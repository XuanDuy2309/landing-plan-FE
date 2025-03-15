export const LeftBarLogin = () => {
    return <div className="w-[496px]">
      <div className="w-16 h-16 bg-gray-300 rounded-full mb-6"></div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Recent logins</h1>
        <p className="text-gray-500">Click your picture or add an account</p>
      </div>
      <div className="flex space-x-4">
        <div className="flex flex-col items-center">
          <div className="relative w-45 h-51 bg-cover bg-center rounded-lg mb-2 bg-gray-200">
            <button className="absolute top-1 left-1 w-6 h-6 text-white rounded-full flex items-center justify-center text-xs">
              X
            </button>
          </div>
          <p className="text-gray-800 font-medium">Mika Lee</p>
        </div>
        <div className="w-45 h-51 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300">
          <span className="text-gray-500 text-2xl">+</span>
          <p className="text-gray-500 mt-2">Add an account</p>
        </div>
      </div>
    </div>;
}