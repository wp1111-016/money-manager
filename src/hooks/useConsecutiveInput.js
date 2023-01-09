import React from "react";

const useConsecutiveInput = (inputNumber, submitHandler) => {
    const inputRefs = Array(inputNumber).fill(0).map(() => React.useRef());
    const submitRef = React.useRef();

    const inputStatusState = Array(inputNumber).fill(0).map(() => React.useState("basic"));
    const inputStatus = inputStatusState.map((state) => state[0]);
    const setInputStatus = inputStatusState.map((state) => state[1]);

    return {
        inputRefs: inputRefs,
        inputStatus: inputStatus,
        nextInputFuncs: inputRefs.map((_, index) => () => {
            if (index + 1 < inputNumber) {
                inputRefs[index + 1].current.focus();
            } else {
                inputRefs[index].current.blur();
                if (submitRef.current && submitRef.current.props.onPress)
                    submitRef.current.props.onPress()
            }
        }),
        submitRef: submitRef,
        onSubmit: () => {
            let allValid = true;
            let firstInvalidIndex = -1;
            for (let i = 0; i < inputNumber; i++) {
                if (inputRefs[i].current.props.value === "") {
                    setInputStatus[i]("danger");
                    allValid = false;
                    if (firstInvalidIndex === -1)
                        firstInvalidIndex = i;
                } else {
                    setInputStatus[i]("basic");
                }
            }
            if (allValid && submitHandler)
                submitHandler();
            else if (firstInvalidIndex !== -1)
                inputRefs[firstInvalidIndex].current.focus();
        },
    };
};

export default useConsecutiveInput;