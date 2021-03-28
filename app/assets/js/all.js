let data = [];
let dataStr = ''
let dataLength;
let index;
const ticketName = document.querySelector('#name');
const ticketImgUrl = document.querySelector('#imgurl');
const ticketArea = document.querySelector('#area');
const ticketPrice = document.querySelector('#price');
const ticketNumber = document.querySelector('#number');
const ticketScore = document.querySelector('#score');
const ticketDescription = document.querySelector('#description');
let state = 'success';
let submit = document.querySelector('.submit');

function init() {
  axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
    .then(function (response) {
      data = response.data.data;
      index = data.length - 1;
      showData();
      renderC3()
    })
}



function formInit() {
  ticketName.value = '';
  ticketImgUrl.value = '';
  ticketArea.value = '';
  ticketPrice.value = '';
  ticketNumber.value = '';
  ticketScore.value = '';
  ticketDescription.value = '';

}
function buildData(data) {
  let card = ` <li class="col-md mb-7">
  <div class="card ">
     <div class="card__head">
         <a href=""><img class="card__img"
                 src="${data.imgUrl}"
                 alt=""></a>
         <div class="card__city">${data.area}</div>
         <div class="card__score">${data.rate}</div>
     </div>
     <div class="card__body">
        <div>
          <h2 class="card__title">${data.name}</h2>
          <div class="card__text">
           ${data.description}
         </div>
         </div>
         <div class="d-flex justify-content-between align-items-center">
             <p class="text-primary font-medium lh-1"><span class="material-icons pe-2">
                     error
                 </span>剩下最後 ${data.group} 組</p>
             <p class="d-flex align-items-center text-primary font-medium">TWD<span
                     class="text-2xl ps-1">${data.price}</span></p>
         </div>
     </div>
 </div>
</li>`;
  return card;
}
function addData() {

  index += 1;
  let item = {
    id: index,
    name: ticketName.value,
    imgUrl: ticketImgUrl.value,
    area: ticketArea.value,
    description: ticketDescription.value,
    group: ticketNumber.value,
    price: ticketPrice.value,
    rate: ticketScore.value
  }
  data.unshift(item);

}
function updateData(area) {
  dataStr = '';
  let searchData = []
  if (area != '全部地區') {
    data.forEach(function (item) {
      if (item.area == area) {
        searchData.push(item);
        document.querySelector('.js-dataLength').innerHTML = `本次搜尋共${searchData.length}筆資料`;
      }
    })
  } else {
    searchData = data;
    document.querySelector('.js-dataLength').innerHTML = `全部共${searchData.length}筆資料`;

  }
  searchData.forEach(function (item) {
    dataStr += buildData(item);
  })
  document.querySelector('.js-data').innerHTML = dataStr;
}

function showData() {
  dataStr = ''

  data.forEach(function (item) {
    dataStr += buildData(item);
  });
  dataLength = data.length;
  document.querySelector('.js-data').innerHTML = dataStr;
  document.querySelector('.js-dataLength').innerHTML = `全部共${dataLength}筆資料`;
}

function renderC3() {
  let totalData = {};
  let areaName;
  let c3Data = [];
  console.log(data)
  data.forEach(function (item) {
    if (totalData[item.area] == undefined) {
      totalData[item.area] = 1;
    } else {
      totalData[item.area] += 1;
    }
  })
  areaName = Object.keys(totalData);
  areaName.forEach(function (item) {
    let obj = [];
    obj.push(item);
    obj.push(totalData[item]);
    c3Data.push(obj);
  })

  let chart = c3.generate({
    bindto: '.chart',
    data: {
      columns: c3Data,
      type: "donut",

      colors: {
        "高雄": "#E68618",
        "台中": "#5151D3",
        "台北": "#26C0C7"
      }
    },
    donut: {
      title: "套票地區比重",
      width: 15,
      label: {
        show: false
      }
    },
    size: {
      height: 240,
      width: 250
    },
  });

}

function quickValidation(field) {

  if (field.value != '') {
    field.classList.remove("error");
    field.nextSibling.nextSibling.classList.remove("show-feedback")
  }

};

function rangeValidation(field) {
  let num = field.value;

  if (num < 1 || num > 10) {
    field.classList.add("error");
    field.nextSibling.nextSibling.classList.add("show-feedback");
    state = "failed";
  } else {
    field.classList.remove("error");
    field.nextSibling.nextSibling.classList.remove("show-feedback");
    state = "success";
  }
}

function formValidation() {

  let forms = document.querySelectorAll('.is-required');
  forms.forEach(function (item, index) {

    if (item.value == '') {
      state = "failed";
      item.classList.add("error");
      item.nextSibling.nextSibling.classList.add("show-feedback")
    } else {
      if (index == 3) {
        rangeValidation(ticketScore)
      }
    }
  });
  if (state == 'failed') {
    document.querySelector('.error').focus();
  }

  return state;
}

ticketName.addEventListener('keyup', function () {
  quickValidation(ticketName);
});
ticketImgUrl.addEventListener('change', function () {
  quickValidation(ticketImgUrl);
});
ticketPrice.addEventListener('change', function () {
  quickValidation(ticketPrice);
});
ticketNumber.addEventListener('change', function () {
  quickValidation(ticketNumber);
});

ticketScore.addEventListener('change', function () {
  rangeValidation(ticketScore);

});
ticketDescription.addEventListener('keyup', function () {
  quickValidation(ticketDescription);
});


submit.addEventListener('click', function (e) {
  e.preventDefault();
  let state = formValidation();
  if (state == 'success') {
    addData();
    showData();
    renderC3()
    formInit();
  }
});

// 下拉選單功能 jQuery
$(document).ready(function () {
  $('[data-toggle="dropdown"]').click(function (e) {
    e.preventDefault();
    $(this).nextAll('.js-dropdown-menu').slideToggle();
  });
  $('[data-toggle="dropdown"]').focusout(function (e) {

    $(this).nextAll('.js-dropdown-menu').slideUp();
  });
  $('.js-dropdown-link').click(function () {
    let select = $(this).text();
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
    $(this).parent().prevAll('[data-toggle="dropdown"]').val(select);

  });
  $('.js-area ').click(function () {
    $(this).parent().prevAll('[data-toggle="dropdown"]').removeClass('error')
    $(this).parent().prevAll('.invalid-feedback').removeClass('show-feedback');;
  })
  $('.js-search .js-dropdown-link').click(function () {
    let select = $(this).text();
    updateData(select);
  });
});


init()
