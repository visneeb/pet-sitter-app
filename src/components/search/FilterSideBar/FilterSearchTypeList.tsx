export default function FilterSearchTypeList() {

    const petType = ["Dog", "Cat", "Bird", "Rabbit"];

    return (
      <div className="flex flex-col gap-2 ">
        <p className="style-body-2 ">Pet Type:</p>
        <div className="flex flex-wrap justify-start gap-x-5 gap-y-2">
          {petType.map((pet) => {
            return (
              <label
                key={pet}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="checkbox checked:bg-orange-400 checked:text-orange-800 checked:shadow-lg"
                />
                <span className="style-body-2 text-gray-600 group-hover:text-orange-600 transition">
                  {pet}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    )
}