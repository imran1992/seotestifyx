import { useState } from "react";

const useInputChange = () => {
  const [input, setInput] = useState({});

  const handleInputChange = e => {
    console.log(e, 'e is the');
    
    if (e === "wipe") {
      setInput({});
    } else if (e.currentTarget) {
      setInput({
        ...input,
        [e.currentTarget.name || e.target.name]:
          e.currentTarget.value || e.target.value
      });
    } else {
      setInput({
        ...input,
        ...e
      });
    }
  };

  return [input, handleInputChange];
};

export default useInputChange;
