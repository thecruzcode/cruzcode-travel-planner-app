function checkInput(leavingFromText, goingToText) {
    let urlRGEX = /^[a-zA-Z\s]{0,255}$/;
    if (urlRGEX.test(leavingFromText) && urlRGEX.test(goingToText)) {
        return
    } else {
        alert("Enter valid name, please!")
    }
}

export { checkInput }