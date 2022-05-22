export class OverMenu {
    public static init() {
        let open_menu_btns = Array.prototype.slice.call(document.getElementsByClassName("open-menu-btn"));
        open_menu_btns.forEach((item: HTMLElement) => {
            item.addEventListener("click", () => {
                let target_id = item.getAttribute("for");
                if (target_id == null || target_id == "") return;

                let target_dom = document.getElementById(target_id);
                target_dom?.classList.add("is-show");
                
            });
        });

        let close_menu_btns = Array.prototype.slice.call(document.getElementsByClassName("close-menu-btn"));
        close_menu_btns.forEach((item: HTMLElement) => {
            item.addEventListener("click", () => {
                let target_id = item.getAttribute("for");
                if (target_id == null || target_id == "") return;

                let target_dom = document.getElementById(target_id);
                target_dom?.classList.remove("is-show");
            });
        });
    }
}