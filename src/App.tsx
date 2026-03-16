import { periodSelectStyles } from './utils/styles'
import Select from 'react-select'


function App() {
  const teste = [{ value: "2026-03", label: "março/2026" }, { value: "2026-04", label: "abril/2026" }]

  return (
    <main className="min-h-screen bg-[#F4F2EC] p-4 sm:p-6">
      <div className="w-full flex justify-between pr-[14rem]">
        <div className="w-full max-w-[180px] sm:max-w-[200px] ml-6 bg-white border border-black rounded-lg shadow-md">
          <p className="bg-[#425F8A] rounded-t-lg text-white font-bold text-center p-2 border-b border-gray-500 cursor-default">
            Período
          </p>
          <Select
            options={teste}
            styles={periodSelectStyles}
            defaultValue={teste[0]}
            isSearchable={false}
          />
        </div>
        <div>
          <div className="inline-flex items-center bg-red-500 p-2 rounded-lg border-2 border-gray-500">
            <figure className="cursor-default">
              <img
                src="/icons/money_off.svg"
                alt="Despesas"
              />
            </figure>
            <div className="ml-[0.3rem] font-nunito text-white 2xl:text-lg whitespace-nowrap cursor-default">
              Despesas
            </div>
          </div>
        </div>
        <div>
          <div className="inline-flex items-center bg-green-500 p-2 rounded-lg border-2 border-gray-500">
            <figure className="cursor-default">
              <img
                src="/icons/savings.svg"
                alt="Receitas"
              />
            </figure>
            <div className="ml-[0.3rem] font-nunito text-white 2xl:text-lg whitespace-nowrap cursor-default">
              Receitas
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;