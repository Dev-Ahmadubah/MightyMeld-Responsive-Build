export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Back
          className="inline-block h-16 w-16 sm:size-20 md:size-20  lg:size-24  bg-indigo-300 text-center rounded-lg"
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className="inline-block size-16 sm:size-20 md:size-20 lg:size-24 text-white bg-indigo-500 p-2 rounded-lg">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="inline-block size-16 sm:size-20 md:size-20 lg:size-24 p-2  text-indigo-200">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip }) {
  return <div onClick={flip} className={className}></div>;
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}
function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}