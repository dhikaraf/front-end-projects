console.log('welcome to mortgage-calculator');

function calculateRepayments() {
  // Ambil Tag HTML
  let amountInput = document.getElementById('mortgage-amount'); // (P)
  let termInput = document.getElementById('mortgage-term');
  let interestInput = document.getElementById('interest-rate');
  let mortgageInput = document.querySelector(
    'input[name="mortgage-type"]:checked',
  );

  // "Results" Tag
  let sectionResults = document.getElementsByClassName('results-contents');
  let resultsContainer = document.getElementsByClassName('container-results');
  let headerResults = 'Your results';
  let descriptionResults = `Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate repayments” again. Your monthly repayments Total you'll repay over the term`;

  // Simpan Nilai/Konten dari Tag HTML
  let amountValue = parseFloat(amountInput.value);
  let termValue = parseInt(termInput.value);
  let interestValue = parseFloat(interestInput.value);
  let mortgageValue;

  if (mortgageInput === null) {
    window.alert('Pilih Jenis Hipotek');
    mortgageValue = undefined;
  } else {
    mortgageValue = mortgageInput.value;
    // Validasi Ketersediaan Input
    inputValueValidation(amountValue, termValue, interestValue, mortgageValue);

    // Check Tipe Mortgage
    if (mortgageValue === 'interest only') {
      let interestOnlyResult = calculateInterestOnlyMortgage(
        amountValue,
        interestValue,
        termValue,
      );
      let totalRepayment = totalPaymentsForInterestOnlyType(
        amountValue,
        interestValue,
        termValue,
      );

      console.log('RESULT FOR INTEREST ONLY\n');
      console.log(`Your Monthly Repayments : ${interestOnlyResult}\n`);
      console.log(`Total you'll repay over the term : ${totalRepayment}\n`);

      changeContentToResults(interestOnlyResult, totalRepayment);
    } else {
      let repaymentResult = calculateRepaymentMortgage(
        amountValue,
        interestValue,
        termValue,
      );
      let totalRepayment = totalPaymentsForRepaymentsType(
        amountValue,
        interestValue,
        termValue,
      );

      console.log('RESULT FOR REPAYMENT\n');
      console.log(`Your Monthly Repayments : ${repaymentResult}\n`);
      console.log(`Total you'll repay over the term : ${totalRepayment}\n`);
      changeContentToResults(repaymentResult, totalRepayment);
    }
  }
}

// Fungsi Validasi Ketersediaan Input
function inputValueValidation(
  amountInput,
  termInput,
  interestInput,
  mortgageInput,
) {
  if (!amountInput || !termInput || !interestInput || !mortgageInput) {
    window.alert('Isi Seluruh Kolom');
    return;
  } else {
    console.log(
      `Mortgage Amount : ${amountInput} Type : ${typeof amountInput}`,
    );
    console.log(`Mortgage Term : ${termInput} Type : ${typeof termInput}`);
    console.log(
      `Mortgage interest rate : ${interestInput} Type : ${typeof interestInput}`,
    );
    console.log(
      `Mortgage Type : ${mortgageInput} Type : ${typeof mortgageInput}\n`,
    );
  }
}

// Fungsi Perhitungan Mortgage Type = "Interest Only"
function calculateInterestOnlyMortgage(
  mortgageAmountInput,
  interesetRateInput,
  mortgageTermInput,
) {
  // MonthlyInterest (r)
  let monthlyInterest = calculateMonthlyInterest(interesetRateInput);
  // TotalMonth (n)
  let totalMonth = calculateTotalMonth(mortgageTermInput);
  // MonthlyInstallments (M)
  let monthlyInstallments = mortgageAmountInput * monthlyInterest;

  return monthlyInstallments;
}

// Total Payments for "Interest Only"
function totalPaymentsForInterestOnlyType(
  mortgageAmountInput,
  interesetRateInput,
  mortgageTermInput,
) {
  let monthlyInstallments = calculateInterestOnlyMortgage(
    mortgageAmountInput,
    interesetRateInput,
    mortgageTermInput,
  );

  // TotalMonth (n)
  let totalMonth = calculateTotalMonth(mortgageTermInput);

  // Total Payment
  let totalPayments = monthlyInstallments * totalMonth + mortgageAmountInput;

  return totalPayments;
}

// Fungsi Perhitungan Mortgage Type = "Repayment"
function calculateRepaymentMortgage(
  mortgageAmountInput,
  interesetRateInput,
  mortgageTermInput,
) {
  // MonthlyInterest (r)
  let monthlyInterest = calculateMonthlyInterest(interesetRateInput);
  // TotalMonth (n)
  let totalMonth = calculateTotalMonth(mortgageTermInput);
  //  (1 + r) ^ n
  let compoundedInterest = Math.pow(1 + monthlyInterest, totalMonth);
  // r * (firstParam)
  let numerator = monthlyInterest * compoundedInterest;
  // firstParam - 1
  let denominator = compoundedInterest - 1;
  // MonthlyInstallments (M) = P * (r * (firstParam) / firstParam - 1)
  let monthlyInstallments = mortgageAmountInput * (numerator / denominator);

  return monthlyInstallments;
}

// Total Payments for "Repayment"
function totalPaymentsForRepaymentsType(
  mortgageAmountInput,
  interesetRateInput,
  mortgageTermInput,
) {
  let monthlyInstallments = calculateRepaymentMortgage(
    mortgageAmountInput,
    interesetRateInput,
    mortgageTermInput,
  );
  // TotalMonth (n)
  let totalMonth = calculateTotalMonth(mortgageTermInput);
  // Total Payment
  let totalPayments = monthlyInstallments * totalMonth;

  return totalPayments;
}

// Fungsi Perhitungan Bunga/Bulan "Monthly Interest" (r)
function calculateMonthlyInterest(interestRateInput) {
  let monthlyInterest = interestRateInput / (100 * 12);
  return monthlyInterest;
}

// Fungsi Perhitungan Total Bulan (n)
function calculateTotalMonth(mortgageTermInput) {
  let totalMonth = mortgageTermInput * 12;
  return totalMonth;
}

// Fungsi Manipulasi Konten
function changeContentToResults(monthlyInstallments, totalPayments) {
  let monthlyInstallmentsValue = monthlyInstallments;
  let totalPaymentsValue = totalPayments;

  // Format Mata uang "Pound Sterling"
  let monthlyPayment = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(monthlyInstallmentsValue);
  let totalPayment = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(totalPaymentsValue);

  // "Results" Tag
  let sectionResults = document.getElementsByClassName('results-contents')[0];
  let resultsContainer =
    document.getElementsByClassName('container-results')[0];
  let containerTotalResults = document.getElementsByClassName(
    'containerTotalResults',
  )[0];
  let containerMonthlyResult = document.getElementById('monthlyValueResult');
  let containerTotalResult = document.getElementById('totalRepaymentResult');

  // Teks Pengganti
  let headerResults = 'Your results';
  let descriptionResults = `Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate repayments” again. Your monthly repayments Total you'll repay over the term`;

  // Ubah isi konten
  resultsContainer.style.textAlign = 'start';
  containerTotalResults.style.display = 'flex';
  sectionResults.children[0].innerHTML = '';
  containerMonthlyResult.innerHTML = monthlyPayment;
  containerTotalResult.innerHTML = totalPayment;
  resultsContainer.children[0].innerHTML = headerResults;
  resultsContainer.children[1].innerHTML = descriptionResults;
  resultsContainer.children[1].style.textAlign = 'start';
}
