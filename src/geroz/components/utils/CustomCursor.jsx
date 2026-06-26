import { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorOuterRef = useRef(null);

  useEffect(() => {
    // Check if mobile or cursor element exists
    if (
      document.body.classList.contains("is-mobile") ||
      !document.querySelector("#custom-cursor-wrapper.tp-cursor")
    ) {
      return;
    }

    const cursorDot = cursorDotRef.current;
    const cursorOuter = cursorOuterRef.current;

    if (!cursorDot || !cursorOuter) return;

    // Wrap magnetic items
    const magneticItems = document.querySelectorAll(".tp-magnetic-item");
    magneticItems.forEach((item) => {
      if (!item.parentElement?.classList.contains("tp-magnetic-wrap")) {
        const wrapper = document.createElement("div");
        wrapper.className = "tp-magnetic-wrap";
        item.parentNode?.insertBefore(wrapper, item);
        wrapper.appendChild(item);
      }

      if (item.tagName === "A") {
        item.classList.add("not-hide-cursor");
      }
    });

    // Cursor variables
    const mouse = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    const ratio = 0.15;
    let active = false;

    const cursorDotWidth = 14;
    const cursorDotHeight = 14;
    const cursorDotScale = 1;
    const cursorDotOpacity = 1;
    const cursorDotBorderWidth = 1;

    // Set initial cursor styles
    gsap.set(cursorDot, {
      xPercent: -50,
      yPercent: -50,
      width: cursorDotWidth,
      height: cursorDotHeight,
      borderWidth: cursorDotBorderWidth,
      opacity: cursorDotOpacity,
    });

    // Mouse move handler
    const mouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    document.addEventListener("mousemove", mouseMove);

    // Update cursor position
    const updatePosition = () => {
      if (!active) {
        pos.x += (mouse.x - pos.x) * ratio;
        pos.y += (mouse.y - pos.y) * ratio;

        gsap.set(cursorDot, { x: pos.x, y: pos.y });
      }
    };

    gsap.ticker.add(updatePosition);

    // Parallax functions
    const parallaxIt = (
      e,
      parent,
      target,
      movement
    ) => {
      const boundingRect = parent.getBoundingClientRect();
      const relX = e.clientX - boundingRect.left;
      const relY = e.clientY - boundingRect.top;

      gsap.to(target, {
        duration: 0.3,
        x: ((relX - boundingRect.width / 2) / boundingRect.width) * movement,
        y: ((relY - boundingRect.height / 2) / boundingRect.height) * movement,
        ease: "power2.out",
      });
    };

    const callParallax = (e, parent) => {
      const target = parent.querySelector(".tp-magnetic-item");
      if (target) {
        parallaxIt(e, parent, target, 25);
      }
    };

    const parallaxCursor = (
      e,
      parent,
      movement
    ) => {
      const rect = parent.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      pos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
      pos.y = rect.top + rect.height / 2 + (relY - rect.height / 2) / movement;
      gsap.to(cursorDot, { duration: 0.3, x: pos.x, y: pos.y });
    };

    // Helper function for RTL check
    const isRtl = () => {
      return document.documentElement.dir === "rtl";
    };

    // Magnetic wrap handlers
    const magneticWraps = document.querySelectorAll(".tp-magnetic-wrap");
    const magneticHandlers = [];

    magneticWraps.forEach((wrap) => {
      const mousemoveHandler = (e) => {
        const mouseEvent = e;
        parallaxCursor(mouseEvent, wrap, 2);
        callParallax(mouseEvent, wrap);
      };

      const mouseenterHandler = () => {
        gsap.to(cursorDot, {
          duration: 0.3,
          scale: 2,
          borderWidth: 1,
          opacity: cursorDotOpacity,
        });
        active = true;
      };

      const mouseleaveHandler = () => {
        gsap.to(cursorDot, {
          duration: 0.3,
          scale: cursorDotScale,
          borderWidth: cursorDotBorderWidth,
          opacity: cursorDotOpacity,
        });
        const magneticItem = wrap.querySelector(".tp-magnetic-item");
        if (magneticItem) {
          gsap.to(magneticItem, {
            duration: 0.3,
            x: 0,
            y: 0,
            clearProps: "all",
          });
        }
        active = false;
      };

      wrap.addEventListener("mousemove", mousemoveHandler);
      wrap.addEventListener("mouseenter", mouseenterHandler);
      wrap.addEventListener("mouseleave", mouseleaveHandler);

      magneticHandlers.push({
        element: wrap,
        mousemove: mousemoveHandler,
        mouseenter: mouseenterHandler,
        mouseleave: mouseleaveHandler,
      });
    });

    // Data cursor handlers
    const dataCursorElements = document.querySelectorAll("[data-cursor]");
    const dataCursorHandlers = [];

    dataCursorElements.forEach((element) => {
      const mouseenterHandler = () => {
        cursorDot.classList.add("with-blur");

        // Remove any existing view divs first
        const existingView = cursorDot.querySelector(".cursorDot-view");
        if (existingView) {
          existingView.remove();
        }

        const viewDiv = document.createElement("div");
        viewDiv.className = "cursorDot-view";
        viewDiv.innerHTML = element.getAttribute("data-cursor") || "";
        cursorDot.appendChild(viewDiv);

        gsap.to(cursorDot, {
          duration: 0.3,
          xPercent: isRtl() ? 50 : -50,
          yPercent: -60,
          width: 110,
          height: 110,
          opacity: 1,
          borderWidth: 0,
          zIndex: 1,
          backdropFilter: "blur(14px)",
          backgroundColor: "#fff",
        });
        gsap.to(viewDiv, {
          duration: 0.3,
          scale: 1,
          autoAlpha: 1,
        });
      };

      const mouseleaveHandler = () => {
        const viewDiv = cursorDot.querySelector(".cursorDot-view");
        if (viewDiv) {
          gsap.to(viewDiv, {
            duration: 0.3,
            scale: 0,
            autoAlpha: 0,
            onComplete: () => {
              viewDiv.remove();
              cursorDot.classList.remove("with-blur");
            },
          });
        } else {
          cursorDot.classList.remove("with-blur");
        }

        gsap.to(cursorDot, {
          duration: 0.3,
          xPercent: -50,
          yPercent: -50,
          width: cursorDotWidth,
          height: cursorDotHeight,
          opacity: cursorDotOpacity,
          borderWidth: cursorDotBorderWidth,
          backgroundColor: "#000",
          backdropFilter: "none",
          zIndex: "auto",
          clearProps: "backgroundColor,backdropFilter,zIndex",
        });
      };

      element.addEventListener("mouseenter", mouseenterHandler);
      element.addEventListener("mouseleave", mouseleaveHandler);
      element.classList.add("not-hide-cursor");

      dataCursorHandlers.push({
        element,
        mouseenter: mouseenterHandler,
        mouseleave: mouseleaveHandler,
      });
    });

    // Data cursor2 handlers
    const dataCursor2Elements = document.querySelectorAll("[data-cursor2]");
    const dataCursor2Handlers = [];

    dataCursor2Elements.forEach((element) => {
      const mouseenterHandler = () => {
        cursorDot.classList.add("with-blur");

        // Remove any existing drag divs first
        const existingDrag = cursorDot.querySelector(".cursorDot-drag");
        if (existingDrag) {
          existingDrag.remove();
        }

        const dragDiv = document.createElement("div");
        dragDiv.className = "cursorDot-drag";
        dragDiv.innerHTML = element.getAttribute("data-cursor2") || "";
        cursorDot.appendChild(dragDiv);

        gsap.to(cursorDot, {
          duration: 0.3,
          xPercent: isRtl() ? 50 : -50,
          yPercent: -60,
          width: 110,
          height: 110,
          opacity: 1,
          borderWidth: "1px",
          borderColor: "rgba(255, 255, 255, 0.22)",
          zIndex: 1,
          backdropFilter: "blur(34px)",
          backgroundColor: "rgba(255, 255, 255, 0.30)",
          boxShadow: "11px 11px 32.2px 0px rgba(255, 255, 255, 0.12) inset",
        });
        gsap.to(dragDiv, {
          duration: 0.3,
          scale: 1,
          autoAlpha: 1,
        });
      };

      const mouseleaveHandler = () => {
        const dragDiv = cursorDot.querySelector(".cursorDot-drag");
        if (dragDiv) {
          gsap.to(dragDiv, {
            duration: 0.3,
            scale: 0,
            autoAlpha: 0,
            onComplete: () => {
              dragDiv.remove();
              cursorDot.classList.remove("with-blur");
            },
          });
        } else {
          cursorDot.classList.remove("with-blur");
        }

        gsap.to(cursorDot, {
          duration: 0.3,
          xPercent: -50,
          yPercent: -50,
          width: cursorDotWidth,
          height: cursorDotHeight,
          opacity: cursorDotOpacity,
          borderWidth: cursorDotBorderWidth,
          backgroundColor: "#333333",
          backdropFilter: "none",
          borderColor: "transparent",
          boxShadow: "none",
          zIndex: "auto",
          clearProps:
            "backgroundColor,backdropFilter,borderColor,boxShadow,zIndex",
        });
      };

      element.addEventListener("mouseenter", mouseenterHandler);
      element.addEventListener("mouseleave", mouseleaveHandler);
      element.classList.add("not-hide-cursor2");

      dataCursor2Handlers.push({
        element,
        mouseenter: mouseenterHandler,
        mouseleave: mouseleaveHandler,
      });
    });

    // Hide cursor on links and buttons (excluding special cursor elements)
    const hideElements = document.querySelectorAll(
      "a:not(.cursor-hide):not(.not-hide-cursor):not(.not-hide-cursor2):not([data-cursor]):not([data-cursor2]), button:not(.cursor-hide):not(.not-hide-cursor):not(.not-hide-cursor2)"
    );
    const hideHandlers = [];

    hideElements.forEach((element) => {
      const mouseenterHandler = () => {
        gsap.to(cursorDot, { duration: 0.3, scale: 0, opacity: 0 });
      };

      const mouseleaveHandler = () => {
        gsap.to(cursorDot, {
          duration: 0.3,
          scale: cursorDotScale,
          opacity: cursorDotOpacity,
        });
      };

      element.addEventListener("mouseenter", mouseenterHandler);
      element.addEventListener("mouseleave", mouseleaveHandler);

      hideHandlers.push({
        element,
        mouseenter: mouseenterHandler,
        mouseleave: mouseleaveHandler,
      });
    });

    // Hide cursor on link click
    const clickElements = document.querySelectorAll(
      'a:not([target="_blank"]):not(.cursor-hide):not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not(.lg-trigger):not(.tp-btn-disabled a)'
    );
    const clickHandlers = [];

    clickElements.forEach((element) => {
      const clickHandler = () => {
        gsap.to(cursorDot, { duration: 0.3, scale: 1.3, autoAlpha: 0 });
      };

      element.addEventListener("click", clickHandler);
      clickHandlers.push({ element, click: clickHandler });
    });

    // Document leave/enter handlers
    const documentLeaveHandler = () => {
      gsap.to(cursorOuter, { duration: 0.3, autoAlpha: 0 });
    };

    const documentEnterHandler = () => {
      gsap.to(cursorOuter, { duration: 0.3, autoAlpha: 1 });
    };

    const documentMoveHandler = () => {
      gsap.to(cursorOuter, { duration: 0.3, autoAlpha: 1 });
    };

    document.addEventListener("mouseleave", documentLeaveHandler);
    document.addEventListener("mouseenter", documentEnterHandler);
    document.addEventListener("mousemove", documentMoveHandler);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseleave", documentLeaveHandler);
      document.removeEventListener("mouseenter", documentEnterHandler);
      document.removeEventListener("mousemove", documentMoveHandler);

      gsap.ticker.remove(updatePosition);

      magneticHandlers.forEach(
        ({ element, mousemove, mouseenter, mouseleave }) => {
          element.removeEventListener("mousemove", mousemove);
          element.removeEventListener("mouseenter", mouseenter);
          element.removeEventListener("mouseleave", mouseleave);
        }
      );

      dataCursorHandlers.forEach(({ element, mouseenter, mouseleave }) => {
        element.removeEventListener("mouseenter", mouseenter);
        element.removeEventListener("mouseleave", mouseleave);
      });

      dataCursor2Handlers.forEach(({ element, mouseenter, mouseleave }) => {
        element.removeEventListener("mouseenter", mouseenter);
        element.removeEventListener("mouseleave", mouseleave);
      });

      hideHandlers.forEach(({ element, mouseenter, mouseleave }) => {
        element.removeEventListener("mouseenter", mouseenter);
        element.removeEventListener("mouseleave", mouseleave);
      });

      clickHandlers.forEach(({ element, click }) => {
        element.removeEventListener("click", click);
      });
    };
  }, []);

  return (
    <div id="custom-cursor-wrapper" className="tp-cursor">
      <div id="cursor-outer" ref={cursorOuterRef}>
        <div id="cursorDot" ref={cursorDotRef}></div>
      </div>
    </div>
  );
};

export default CustomCursor;
