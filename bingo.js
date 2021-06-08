$(document).ready(function () {

  const bingo = new Bingo
  bingo.initializeDashboard(1)
  bingo.initializeDashboard(2)

  $(".start").on("click", function () {
    bingo.roll()
  })

  $(".reset").on("click", function () {
    bingo.reset()
  })

})

class Bingo {

  unselected_numbers = []
  selected_number = []
  hit_sheet1 = []
  hit_sheet2 = []
  cur_count = 0
  hit_count = 0

  constructor() {
    this.initializeUnselectedNumbers()
  }

  getRandomNumber = () => {
    const selected_number = this.unselected_numbers[Math.floor(Math.random() * this.unselected_numbers.length)]
    this.removeNumber(selected_number)
    return selected_number
  }

  removeNumber = (num) => {
    const index = this.unselected_numbers.indexOf(num)
    this.unselected_numbers.splice(index, 1)
    this.selected_numbers.push(num)
  }

  initializeUnselectedNumbers = () => {
    this.unselected_numbers = []
    this.selected_numbers = []
    for (let index = 1; index < 100; index++) {
      this.unselected_numbers.push(index)
    }
  }

  initialize = function () {
    this.cur_count = 0
    this.hit_count = 0

    this.initializeUnselectedNumbers()

    $("#showed_numbers").val("")
    $('td').removeClass('hit-number')
    $('#diced-numbers').text("")
    $('.try-cnt').text(0)
    $('.reach-cnt').text(0)
    $('.hit-cnt').text(0)
    $('.hit-rate').text(0)
    $('.bingo').text("")
    $('.start').attr('disabled', false)
  }

  isBingo = () => {
    return this.countLineSum(5) > 0;
  }

  judgeBingo = () => {
    if (this.isBingo()) {
      $('.bingo').text('BINGOoooooo!!!!!')
      $('.start').attr('disabled', true)
    }
  }

  initializeDashboard = (hit_sheet_num) => {
    const hit_sheet = hit_sheet_num === 1 ? this.hit_sheet1 : this.hit_sheet2 

    for (let row = 1; row <= 5; row++) {
      hit_sheet[row - 1] = []
      for (let col = 1; col <= 5; col++) {
        const selected_number = this.getRandomNumber()
        $(`.bingo${hit_sheet_num} [data-row=${row}][data-col=${col}]`).text(selected_number).attr('data-value', selected_number)
        hit_sheet[row - 1][col - 1] = 0
      }
    }
    if(hit_sheet_num === 1){
      this.hit_sheet1 = hit_sheet
    }else{
      this.hit_sheet2 = hit_sheet
    }
    // 振り直すためにリセット
    this.initializeUnselectedNumbers()
  }

  countReach = () => {
    return this.countLineSum(4);
  }

  /**
   * リーチの数の表示
   */
  setReachCount = () => {
    $('.reach-cnt').text(this.countReach())
  }

  setTryCount = () => {
    $('.try-cnt').text(this.cur_count)
  }

  setHitCount = () => {
    $('.hit-cnt').text(this.hit_count)
    // レート
    $('.hit-rate').text(parseInt((this.hit_count / this.cur_count) * 100))

  }

  setDicedNumbers = () => {
    $('#diced-numbers').text(this.selected_numbers.join(','))
  }
  setCurCount = () => {
    $('.try-cnt').text(this.cur_count)
  }
  setHitCount = () => {
    $('.hit-cnt').text(this.hit_count)
    // レート
    $('.hit-rate').text(parseInt((this.hit_count / this.cur_count) * 100))

  }

  countLineSum = (judgeline, hit_sheet_num) => {
    let judged_count = 0
    let upper_left_count = 0
    let upper_right_count = 0
    const hit_sheet = hit_sheet_num === 1 ? this.hit_sheet1 : this.hit_sheet2
    for (let row = 0; row < 5; row++) {
      // 行
      const row_total = hit_sheet[row].reduce((sum, element) => {
        return sum + element;
      }, 0);
      if (row_total === judgeline) {
        judged_count++
      }
      // 列
      let col_total = 0
      for (let col = 0; col < 5; col++) {
        col_total += hit_sheet[col][row]
      }
      if (col_total === judgeline) {
        judged_count++
      }

      // 斜め
      upper_left_count += hit_sheet[row][row]

      if (upper_left_count === judgeline) {
        judged_count++
      }
      upper_right_count += hit_sheet[row][4 - row]
      if (upper_right_count === judgeline) {
        judged_count++
      }
    }

    return judged_count;
  }


  roll = function (hit_sheet_num) {
    const hit_sheet = hit_sheet_num === 1 ? this.hit_sheet1 : this.hit_sheet2
    this.cur_count++
    const number = this.getRandomNumber()

    const $element = $(`[data-value=${number}]`)
    const $showed_numbers = $("#showed_numbers")
    $showed_numbers.val(number)

    if ($element.length) {
      this.hit_count++
      $element.addClass("hit-number")
      const row_idx = $element.data('row') - 1
      const col_idx = $element.data('col') - 1
      hit_sheet[row_idx][col_idx] = 1

    }


    this.setDicedNumbers()
    this.setCurCount()
    this.setReachCount()
    this.setHitCount()
    this.judgeBingo()

  }

  reset = function () {
    this.initialize()

    this.initializeDashboard(1)
    this.initializeDashboard(2)
  }

}