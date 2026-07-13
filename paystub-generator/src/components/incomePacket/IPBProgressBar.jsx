const STEPS = ['About You', 'Income', 'Expenses', 'Preview & Download']

export default function IPBProgressBar({ current }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => {
        const stepNum = i + 1
        const done = stepNum < current
        const active = stepNum === current
        return (
          <div key={label} className="contents">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                done ? 'bg-green-500 text-white' :
                active ? 'bg-blue-600 text-white' :
                'bg-gray-200 text-gray-400'
              }`}>
                {done ? '✓' : stepNum}
              </div>
              <span className={`text-[11px] text-center leading-tight hidden sm:block ${active ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
          </div>
        )
      })}
    </div>
  )
}
