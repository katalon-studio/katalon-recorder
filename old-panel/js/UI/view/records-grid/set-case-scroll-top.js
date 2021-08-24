function setCaseScrollTop(testCase) {
  if ($(".case_list").scrollTop() > testCase.offsetTop - 143)
    $(".case_list").animate({
      scrollTop: testCase.offsetTop - 143
    }, 10);
  else if ($(".case_list").height() + $(".case_list").scrollTop() - 60 < testCase.offsetTop - $(".case_list").offset().top)
    $(".case_list").animate({
      scrollTop: testCase.offsetTop - $(".case_list").offset().top - ($(".case_list").height() - 60)
    }, 10);
}

export { setCaseScrollTop }