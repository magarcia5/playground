let calculateMonthlyPayment = (principal, years, rate) => {
    if (rate) {
        var monthlyRate = rate / 100 / 12;
    }
    var monthlyPayment = principal * monthlyRate / (1 - (Math.pow(1 / (1 + monthlyRate), years * 12)));
    return { principal, years, rate, monthlyPayment, monthlyRate }  ;
};

let calculateAmortization = (principal, years, rate) => {
    let { monthlyRate, monthlyPayment } = calculateMonthlyPayment(principal, years, rate);
    let balance = principal;
    let amortization = [];
    for (let y=0; y < years; y++){
        let interestY = 0;
        let principalY = 0;
        for(let m=0; m< 12; m++){
            let interestM = balance * monthlyRate;
            let principalM = monthlyPayment - interestM;

            interestY = interestY + interestM;
            principalY = principalY + principalM;
            balance = balance - principalM;
        }
        amortization.push({ principalY, interestY, balance });
    }
    return { monthlyPayment, monthlyRate, amortization };
}

document.getElementById('calcBtn').addEventListener('click', () => {
    var principal = document.getElementById("principal").value;
    var years = document.getElementById("years").value;
    var rate = document.getElementById("rate").value;

    let { monthlyPayment, monthlyRate, amortization } = calculateAmortization(principal, years, rate);

    document.getElementById("monthlyPayment").innerHTML = monthlyPayment.toFixed(2);
    document.getElementById("monthlyRate").innerHTML = (monthlyRate * 100).toFixed(2);

    // kind of like a lambda
    amortization.forEach(month => console.log(month));

});
