import React from "react";

const useConsecutiveInputRefs = (childrenNumber) => {
    const inputRefs = Array(5).fill(0).map(() => React.useRef());
    const submitRef = React.useRef();
    return {
        inputRefs: inputRefs,
        nextInputFuncs: inputRefs.map((_, index) => () => {
            if (index + 1 < childrenNumber) {
                inputRefs[index + 1].current.focus();
            } else {
                console.log("click")
                inputRefs[index].current.blur();
                if (submitRef.current && submitRef.current.props.onPress)
                    submitRef.current.props.onPress()
            }
        }),
        submitRef: submitRef,
    };
};

export default useConsecutiveInputRefs;