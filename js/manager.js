// document.addEventListener("DOMContentLoaded", () => {
//   const sidebar = document.querySelector(".sidebar");
//   const content = document.querySelector(".content");

//   // 상단 메뉴 클릭 시: 사이드바 + 본문 변경
//   // document.querySelectorAll(".menu-bar a").forEach((menuItem) => {
//   //   menuItem.addEventListener("click", (e) => {
//   //     e.preventDefault();
//   //     const menuText = e.target.innerText.trim();

//   //     const sidebarItems = getSidebarByMenu(menuText);
//   //     const url = getMainContentUrl(menuText);

//   //     updateSidebar(sidebarItems);

//   //     if (url) {
//   //       loadContent(url);
//   //     } else {
//   //       content.innerHTML = `<h2>${menuText}</h2><p>해당 메뉴에 대한 컨텐츠가 없습니다.</p>`;
//   //     }
//   //   });
//   // });

//   // 사이드바 클릭 시 본문 내용만 변경
//   sidebar.addEventListener("click", (e) => {
//     const target = e.target;
//     if (target.tagName === "A" && target.closest(".submenu")) {
//       e.preventDefault();
//       const text = target.innerText.trim();
//       updateSubContent(text);
//     }
//   });

//   // 상단 메뉴 -> 사이드바 항목 매핑
//   function getSidebarByMenu(menu) {
//     switch (menu) {
//       case "게시판관리":
//         return {
//           title: "게시판 관리",
//           items: ["프렌차이즈 문의", "고객의소리", "매장현황"]
//         };
//       case "입고":
//         return {
//           title: "입고",
//           items: ["입고등록", "발주", "입고현황"]
//         };
//       case "출고":
//         return {
//           title: "출고",
//           items: []
//         };
//       case "재고":
//         return {
//           title: "재고",
//           items: ["매장별 재고현황", "기초품목등록", "메뉴등록"]
//         };
//       default:
//         return null;
//     }
//   }

//   // 상단 메뉴 -> 본문 HTML 경로 매핑
//   function getMainContentUrl(menu) {
//     switch (menu) {
      
//       case "게시판관리": return "../html/notice_manager.html";
//       case "입고": return "../html/receiving_manager.html";
//       case "출고": return "../html/shipping_manager.html";
//       case "재고": return "../html/inventory_manager.html";
//       default: return null;
//     }
//   }

//   // fetch 로드 (본문 콘텐츠)
//   function loadContent(url) {
//     fetch(url)
//       .then(res => res.text())
//       .then(html => {
//         content.innerHTML = html;
//       })
//       .catch(() => {
//         content.innerHTML = `<p>콘텐츠를 불러오는 데 실패했습니다.</p>`;
//       });
//   }

//   // 사이드바 갱신
//   function updateSidebar(sidebarData) {
//     if (!sidebarData) {
//       sidebar.innerHTML = "<p>사이드바 없음</p>";
//       return;
//     }

//     const submenuHTML = sidebarData.items
//       .map(item => `<li><a href="#">${item}</a></li>`)
//       .join("");

//     sidebar.innerHTML = `
//       <ul>
//         <li class="sub">
//           <a href="#">${sidebarData.title}</a>
//           <ul class="submenu">${submenuHTML}</ul>
//         </li>
//       </ul>
//     `;
//   }

//   // 사이드 메뉴 클릭 시 본문 내용 갱신
//   function updateSubContent(text) {
//     content.innerHTML = `
//       <h2>${text}</h2>
//       <p><strong>${text}</strong> 관련 데이터를 표시합니다.</p>
//     `;
//   }

// });

document.addEventListener('DOMContentLoaded', function () {
  const menuItems = document.querySelectorAll('.submenu li');
  const contentBoxes = document.querySelectorAll('[class^="content_"]');

  menuItems.forEach(item => {
    item.addEventListener('click', function () {
      const targetClass = this.getAttribute('data-target');

      contentBoxes.forEach(box => {
        box.style.display = 'none';
        box.removeAttribute('id');
      });

      const target = document.querySelector('.' + targetClass);
      if (target) {
        target.style.display = 'block';
        target.setAttribute('id', 'on');
      }
    });
  });

  contentBoxes.forEach(box => {
    if (box.id !== 'on') {
      box.style.display = 'none';
    }
  });
});