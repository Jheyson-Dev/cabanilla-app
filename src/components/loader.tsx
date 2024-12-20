const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-row">
        <div className="w-4 h-4 rounded bg-foreground-full bg-back animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-foreground animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-foreground animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  );
};

export default Loader;
