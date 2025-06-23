document.addEventListener("DOMContentLoaded", function () {
  // 기본 페이지 로드
  const defaultPage = document.querySelector('#content-area').getAttribute('data-include');
  if (defaultPage) {
    loadPage(defaultPage);
  }
  initializeSubmenu(); // 서브메뉴 초기화 함수 호출
  initReturnTableHandler({        // 반품리스트
    wrapperSelector: '.return-wrapper',
    buttonSelector: '.return-btn'
  });
});

/*  공통 - 페이지 로드  */
function loadPage(pageUrl) {
  fetch(pageUrl)
    .then(response => {
      if (!response.ok) throw new Error('페이지를 불러올 수 없습니다.');
      return response.text();
    })
    .then(html => {
      document.getElementById('content-area').innerHTML = html;
      
      // 메인 페이지 진입 시 서브메뉴 숨김
      if (
        pageUrl.includes('main_headOffice.html') ||
        pageUrl.includes('main_storeOwner.html')
      ) {
        hideAllSubmenus();
      }

      // 동적으로 삽입된 DOM 안에 차트가 있는 경우에만 실행
      setTimeout(() => {
        if (document.getElementById('monthlySalesChart')) {
          createMonthlySalesChart('monthlySalesChart');
        }
        if (document.getElementById('totalSalesChart')) {
          createtotalSalesChart('totalSalesChart');
        }
      }, 100);



      // 동적으로 로드된 후 초기화할 함수들
      initializeReturnFilter();       // 반품 필터
      initializeReceivingFilter();    // 입고 필터
      initializeSubmenu();            // 서브메뉴
      initReturnTableHandler({        // 반품리스트
              wrapperSelector: '.return-wrapper',
              buttonSelector: '.return-btn'
            });
          })
    .catch(error => {
      console.error(error);
      document.getElementById('content-area').innerHTML = '<p>페이지 로딩 실패</p>';
    });
}

/*  공통 - 메인 메뉴 변경  */
function changeMenu(menu) {
  const allMenus = ["order", "return", "sales", "service", "receiving", "shipping", "inventory",  "board"];

  allMenus.forEach(item => {
    const submenu = document.querySelector(".sub_" + item);
    if (submenu) {
      submenu.style.display = (item === menu) ? "block" : "none";
    }
  });
}

/* 공통 - 체크박스 전체선택 기능 */
function selectAll(selectAll)  {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAll.checked;
  })
}

/* 로고 클릭 시 서브메뉴 숨김 */
function hideAllSubmenus() {
  const submenuGroups = document.querySelectorAll('.sidebar > ul > li');

  submenuGroups.forEach(group => {
    group.style.display = 'none';
  });
}

/* 서브메뉴 초기화 함수 */
function initializeSubmenu() {
  const submenuGroups = document.querySelectorAll('.submenu');

  submenuGroups.forEach(group => {
    const submenuItemsInGroup = group.querySelectorAll('.submenu-item');
    
    // 이미 활성화된 항목이 있으면 초기화 안 함
    const hasActive = Array.from(submenuItemsInGroup).some(item => item.classList.contains('active'));
    if (!hasActive && submenuItemsInGroup.length > 0) {
      submenuItemsInGroup[0].classList.add('active');
    }


    submenuItemsInGroup.forEach(item => {
      item.addEventListener('click', function(event) {
        event.preventDefault();
        submenuItemsInGroup.forEach(otherItem => otherItem.classList.remove('active'));
        this.classList.add('active');
      });
    });
  });
}

/*  점주 관리자 페이지 차트 구현 함수   */
function createMonthlySalesChart(chartId) {
  const ctx = document.getElementById(chartId).getContext('2d');
  if (!ctx) return;

  const monthlySalesData = {
    labels: ['3월', '4월', '5월', '6월', '7월'],
    datasets: [
      {
        label: '총 매출액',
        data: [8200000, 8400000, 9000000, 9500000, 8000000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 5
      }
    ]
  };

  const config = {
    type: 'line',
    data: monthlySalesData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '최근 5개월 매출 추이'
        },
        tooltip: {
          callbacks: {
            label: (context) => `₩${context.parsed.y.toLocaleString()}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `₩${value.toLocaleString()}`
          }
        }
      }
    }
  };

  new Chart(ctx, config);
}

/*  본사 관리자 페이지 차트 구현 함수   */
function createtotalSalesChart(canvasId) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['강남매장', '강동매장', '강서매장', '강북매장'],
      datasets: [
        {
          label: '카페라떼',
          data: [300, 320, 280, 290],
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
        },
        {
          label: '아메리카노',
          data: [400, 380, 360, 370],
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
        },
        {
          label: '초코라떼',
          data: [500, 480, 450, 460],
          backgroundColor: 'rgba(255, 223, 195, 0.8)',
        },
        {
          label: '바닐라라떼',
          data: [400, 320, 300, 280],
          backgroundColor: 'rgba(255, 205, 86, 0.8)',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      maxBarThickness: 150,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true, max: 1800 }
      }
    }
  });
}

/* 입고 현황 필터 초기화 함수 */
function initializeReceivingFilter() {
  const buttons = document.querySelectorAll(".receiving_status_filter_buttons label");
  const receivingTable = document.querySelector('[data-group="receiving"]');

  if (!buttons.length || !receivingTable) return; // 요소 없으면 실행 안 함

  const allRows = receivingTable.querySelectorAll("tbody tr");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // 버튼 활성화 토글
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const status = button.dataset.status;

      allRows.forEach(row => {
        const type = row.children[0]?.textContent.trim();     // 입고유형
        const progress = row.children[4]?.textContent.trim(); // 상태

        let show = false;

        // 조건에 따라 표시 여부 결정
        if (status === "all") {
          show = true;
        } else if (status === "pending" && progress === "진행중") {
          show = true;
        } else if (status === "completed" && progress === "완료") {
          show = true;
        } else if (status === "order_check" && type === "발주") {
          show = true;
        } else if (status === "return_check" && type === "반품") {
          show = true;
        }

        row.style.display = show ? "" : "none";
      });
    });
  });
}

/* 반품 리스트 */
function initReturnTableHandler({
  wrapperSelector = '.return-wrapper',
  buttonSelector = '.return-btn',
}) {
  const returnWrapper = document.querySelector(wrapperSelector);
  if (!returnWrapper) return;

  const returnTableBody = returnWrapper.querySelector('tbody');
  const returnButtons = document.querySelectorAll(buttonSelector);

  returnButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const row = btn.closest('tr');
      if (!row) return;

      const cells = row.querySelectorAll('td');
      const orderNum = cells[0].textContent.trim();
      const itemCode = cells[2].textContent.trim();
      const itemName = cells[3].textContent.trim();

      const alreadyExists = Array.from(returnTableBody.querySelectorAll('tr')).some(tr => {
        return tr.children[1].textContent.trim() === itemCode;
      });

      if (!alreadyExists) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>${orderNum}</td>
          <td>${itemCode}</td>
          <td>${itemName}</td>
          <td><input type="number" value="1" min="1" style="width: 60px;"></td>
          <td><button class="delete-row-btn">삭제</button></td>
        `;
        returnTableBody.appendChild(newRow);
      }

      returnWrapper.style.display = 'block';
      window.scrollTo({ top: returnWrapper.offsetTop, behavior: 'smooth' });
      console.log('initReturnTableHandler 실행됨');
      console.log('returnWrapper:', returnWrapper);
      console.log('returnButtons:', returnButtons.length);
    });
  });

  returnWrapper.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-row-btn')) {
      const row = e.target.closest('tr');
      if (row) row.remove();

      if (returnTableBody.children.length === 0) {
        returnWrapper.style.display = 'none';
      }
    }
  });
}

/*  반품 조회  */
function initializeReturnFilter() { // 탭 변경 이벤트
  const filterButtons = document.querySelectorAll('.return_Inquiry_filter_buttons label');
  const rows = document.querySelectorAll('.return_row');

  if (!filterButtons.length || !rows.length) return; // 요소 없으면 실행하지 않음

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 활성화 스타일 토글
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const status = button.getAttribute('data-status');

      rows.forEach(row => {
        if (status === 'all') {
          row.classList.remove('hidden');
        } else if (status === 'pending') {
          row.classList.toggle('hidden', !row.classList.contains('pending'));
        } else if (status === 'completed') {
          row.classList.toggle('hidden', !row.classList.contains('completed'));
        }
      });
    });
  });
}

/*   주문신청서   */
// 행 추가
function addRow() {
  const tbody = document.querySelector('#orderFormTable tbody');
  let rows = tbody.rows;

  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="checkbox"/></td>
    <td><input type="text"></td>
    <td><input type="text" class="pd_code"></td>
    <td><input type="text" class="pd_name"></td>
    <td class="search_td"><button class="default_btn" onclick="showModal(this)">검색</button></td>
    <td><input type="number"></td>
    <td><input type="number"></td>
    <td><input type="text"></td>
    <td><button onclick="deleteRow(this)" class="del_rowBtn">❌</button></td>
  `;

  // 행이 1개 이상 있을 경우 마지막 전 위치에 추가
  if (rows.length >= 1) {
    tbody.insertBefore(newRow, rows[rows.length - 1]);
  } else {
    tbody.appendChild(newRow); // 행이 없으면 그냥 추가
  }
}

// 행 삭제
function deleteRow(row) {
  const tbody = document.querySelector('#orderFormTable tbody');
  let rows = tbody.rows;
  let thisRow = row.closest('tr');
  if (rows.length > 2) {  //행 1개만 남아있을 땐 삭제 불가
      tbody.removeChild(thisRow);
  }
}

// 검색 버튼 -> 모달
let currentRow = null;  // 클릭된 행 저장할 변수
function showModal(button) { // 검색 버튼 클릭 시 모달 창 열림
  currentRow = button.closest('tr');
  document.getElementById('modalBg').style.display = 'block';
}
function hideModal() { // 모달 창 닫기
  document.getElementById('modalBg').style.display = 'none';
}

// function getInput(e) { // 입력된 값 기입
//   e.preventDefault();
//   let selectedType = document.getElementById('searchProduct').value;

//   if (selectedType === 'product_code') {
//     let value = document.getElementById('inputCode').value;
//     if (currentRow) {
//       currentRow.querySelector('.pd_code').value = value;
//     }
//   } else if (selectedType === 'product_name') {
//       let value = document.getElementById('inputName').value;
//       if (currentRow) {
//         currentRow.querySelector('.pd_name').value = value;
//     }
//   }
// }


// 날짜 유효성 검사
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");

if (startDateInput && endDateInput) {
  startDateInput.addEventListener("change", () => {
    if (endDateInput.value && startDateInput.value > endDateInput.value) {
      alert("시작일은 종료일보다 앞서야 합니다.");
      startDateInput.value = "";
    }
  });

  endDateInput.addEventListener("change", () => {
    if (startDateInput.value && endDateInput.value < startDateInput.value) {
      alert("종료일은 시작일보다 뒤여야 합니다.");
      endDateInput.value = "";
    }
  });
}

/*  메뉴 등록  */
// 행 추가
function menuAddRow() {
  const itemContainer = document.querySelector('.item-container');
  
  // 새로운 줄을 생성
  const newRow = document.createElement('div');
  newRow.classList.add('form-row', 'item-row');
  newRow.innerHTML = `
    <label class="invisible-label">품목코드</label>
    <input type="text" placeholder="품목코드" />
    <span class="label">사용량</span>
    <input type="text" placeholder="사용량" />
    <button type="button" class="delete-btn" onclick="menuDelRow(this)">❌</button>
  `;
  
  // 새로운 줄을 item-container에 추가
  itemContainer.appendChild(newRow);
}

// 행 삭제
function menuDelRow(button) {
  const row = button.closest('.form-row');  // 삭제 버튼이 포함된 행을 찾음
  row.remove();  // 해당 행 삭제
}

// 프로필 정보 수정 <!-- 카카오 주소 API -->
function execDaumPostcode(type) {
  new daum.Postcode({
    oncomplete: function (data) {
      if (type === 'user') {
        document.getElementById('user-postcode').value = data.zonecode;
        document.getElementById('user-address').value = data.address;
        document.getElementById('user-detail-address').focus();
      } else if (type === 'store') {
        document.getElementById('store-postcode').value = data.zonecode;
        document.getElementById('store-address').value = data.address;
        document.getElementById('store-detail-address').focus();
      }
    }
  }).open();
}