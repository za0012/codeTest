interface calendarProp {
  viewYear: number;
  viewMonth: number;
  // firstDay: number;
  daysInMonth: number;
  problemsByDate: Record<string, number>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  today: Date;
  today_local: string;
}

function Calendar({
  viewYear,
  viewMonth,
  // firstDay,
  daysInMonth,
  problemsByDate,
  selectedDate,
  setSelectedDate,
  today,
  today_local,
}: calendarProp) {
  function mondayFirstDay(date: Date) {
  return (date.getDay() + 6) % 7;
}
  const firstDay = mondayFirstDay(new Date(viewYear, viewMonth, 1));

  return (
    <div className="grid grid-cols-7 gap-y-0.5">
      {Array.from({ length: firstDay }).map((_, i) => (
        <div key={`e${i}`} />
      ))}
      {Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1;
        const dateStr = new Date(viewYear, viewMonth, day);
        const dateStrLocal = new Date(
          viewYear,
          viewMonth,
          day,
        ).toLocaleDateString();
        const count = problemsByDate[dateStrLocal] || 0;
        const isToday = dateStrLocal === today_local;
        const isSelected = dateStrLocal === selectedDate;
        const isFuture = dateStr > today;

        return (
          <button
            key={day}
            onClick={() => setSelectedDate(dateStrLocal)}
            disabled={isFuture}
            className="flex flex-col items-center py-0.5 group"
          >
            {count > 0 ? (
              <div
                className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all
                    ${
                      isToday
                        ? "bg-violet-600 shadow-md shadow-violet-200"
                        : isSelected
                          ? "bg-violet-500"
                          : "bg-violet-100 group-hover:bg-violet-200"
                    }
                  `}
              >
                <span
                  className={`${isToday || isSelected ? "text-white" : "text-violet-600"}`}
                  style={{ fontSize: 12, fontWeight: 700 }}
                >
                  {count > 1 ? count : "✓"}
                </span>
              </div>
            ) : (
              <div
                className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all
                    ${isToday ? "bg-blue-200" : isSelected ? "bg-gray-100" : isFuture ? "" : "group-hover:bg-gray-50"}
                  `}
              >
                <span
                  className={`${isToday ? "text-white" : isFuture ? "text-gray-200" : "text-gray-400"}`}
                  style={{ fontSize: 13, fontWeight: isToday ? 700 : 400 }}
                >
                  {day}
                </span>
              </div>
            )}
            {count > 0 && (
              <span
                className={`text-[10px] mt-0.5 ${isSelected ? "text-violet-500" : "text-gray-400"}`}
                style={{ fontWeight: isSelected ? 600 : 400 }}
              >
                {day}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Calendar;
