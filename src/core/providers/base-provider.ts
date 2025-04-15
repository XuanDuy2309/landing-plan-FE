import { action, computed, makeObservable, observable, runInAction } from 'mobx';

export interface SelectionType<T> {
    id: string | number;
    icon?: string;
    label: string;
    value: T;
}

export abstract class ListDataProvider2<T extends { id?: string | number, updated_at?: string }, C = any, U = any, L = any> {
  @observable filter?: L = undefined;
  @observable page: number = 1;
  @observable pageSize: number = 15;
  @observable isRefreshing = false;
  @observable isFetchData = false;
  @observable total?: number;
  @observable isFilter?: boolean;
  @observable dataGroup: any[] = []

  @computed get hasMore(): boolean {
    return (this.total === undefined || (this.total > 0 && this.total > this.data.length) && !this.isFetchData);
  }

  @observable
  public data: T[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  clear(): void {
    this.data.splice(0, this.data.length)
    runInAction(() => {
      this.total = undefined
      this.dataGroup = [];
    })
  }

  @action
  setFilter = (filter: L): void => {
    if (Object.keys(filter as any).length > 0) {
      this.isFilter = true;
    } else
      this.isFilter = false;
    this.filter = filter;
  }

  @action
  refreshData = async (): Promise<number> => {
    this.isRefreshing = true;
    this.page = 1;
    await this.clear();
    const res = await this.fetchMore();
    this.isRefreshing = false;
    return res;
  }

  @action
  fetchMore = async (): Promise<number> => {
    if (this.page === 1) {
      this.isRefreshing = true;
    }
    if (!this.hasMore)
      return 0;
    if (this.isFetchData) return 0;
    this.isFetchData = true
    const res = await this.fetchInternal(this.filter, this.page, this.pageSize);
    runInAction(() => {
      this.page++;
      this.total = res.count;
      this.isRefreshing = false;
      this.isFetchData = false
      for (let i = 0; i < res.list.length; i++) {
        this.data.push(res.list[i]);
      }
    })
    return res.list.length;
  }

  async create(c: C): Promise<T> {
    let res = await this.createInternal(c);
    const needDataSize = Math.round(this.data.length / 10) * 10;
    const listRes = await this.fetchInternal(this.filter, needDataSize, 0);
    runInAction(() => {
      this.data.splice(0, this.data.length)
      this.total = listRes.count;
      this.isFetchData = false
      for (let i = 0; i < listRes.list.length; i++) {
        this.data.push(listRes.list[i]);
      }
    })

    return res;
  }

  async update(u: U): Promise<T> {
    let res = await this.updateInternal(u);
    runInAction(() => {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].id == res.id) {
          this.data[i] = res;
        }
      }
    });
    return res;
  }

  async delete(ids: (number | string)[]): Promise<boolean> {
    let res = await this.deleteInternal(ids);
    runInAction(() => {
      for (let i = 0; i < this.data.length; i++) {
        if (ids.indexOf(this.data[i].id!) >= 0) {
          this.data.splice(i, 1);
          i--;
        }
      }
    })
    return res;
  }

  abstract fetchInternal(filter: any, page: number, pageSize: number): Promise<{ count: number, offset: number, list: T[] }>
  abstract createInternal(c: C): Promise<T>;
  abstract updateInternal(u: U): Promise<T>;
  abstract deleteInternal(id: (number | string)[]): Promise<boolean>;
}

export class StaticDataProvider2<T extends { id: string | number }> extends ListDataProvider2<T, null, null> {
  constructor(private list: T[]) {
    super();
  }

  async fetchInternal(filter: any, take: number, offset: number): Promise<{ count: number; offset: number; list: T[]; }> {
    return {
      list: this.list,
      count: this.list.length,
      offset: 0
    }
  }

  createInternal(c: any): Promise<T> {
    throw new Error('Create not supported');
  }

  updateInternal(u: any): Promise<T> {
    throw new Error('Update not supported');
  }

  deleteInternal(id: (number | string)[]): Promise<boolean> {
    throw new Error('Delete not supported');
  }
}

export abstract class SelectListDataProviderBased<T> extends ListDataProvider2<SelectionType<T>, null, null> {
  createInternal(c: any): Promise<SelectionType<T>> {
    throw new Error('Create not supported');
  }

  updateInternal(u: any): Promise<SelectionType<T>> {
    throw new Error('Update not supported');
  }

  deleteInternal(id: (number | string)[]): Promise<boolean> {
    throw new Error('Delete not supported');
  }
}
