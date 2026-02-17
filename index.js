document.addEventListener("DOMContentLoaded", () => {
    // Add CSS for dots (responsive, centered, bottom)
    const style = document.createElement("style");
    style.textContent = `
    .carousel-dots {
      position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 999 !important;
    pointer-events: auto;
    top: auto;
    }
    .carousel-dot {
      width: 40px;
    height: 6px;
    border-radius: 0%;
    background: #8F8B854D;
    border: none;
    cursor: pointer;
    transition: background 0.3s;
    flex-shrink: 0;
    }
    .carousel-dot.active {
      background: #8F8B85;
    }
    .carousel-dot:hover {
      background: rgba(255,255,255,0.8);
    }

    /* Make sure dots stay centered on small screens */
    @media (max-width: 768px) {
      .carousel-dots {
        bottom: 8px;
        gap: 6px;
      }
      .carousel-dot {
        width: 20px;
        height: 5px;
      }
    }
  `;
    document.head.appendChild(style);

    function initDots() {
      const slideshows = document.querySelectorAll(
        ".user-items-list-carousel__slides",
      );

      slideshows.forEach((slideshow) => {
        if (slideshow.parentElement.querySelector(".carousel-dots")) return;

        const slides = slideshow.querySelectorAll(
          ".user-items-list-carousel__slide",
        );

        // Create dots container
        const dotsContainer = document.createElement("div");
        dotsContainer.className = "carousel-dots";

        slides.forEach((_, index) => {
          const dot = document.createElement("button");
          dot.className = "carousel-dot";
          dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

          dot.addEventListener("click", () => {
            const currentIndex = Array.from(slides).findIndex((slide) =>
              slide.style.transform.includes("translate3d(0"),
            );
            const direction = index > currentIndex ? "right" : "left";
            const button = slideshow.parentElement.querySelector(
              `.user-items-list-carousel__arrow-button--${direction}`,
            );

            if (button) {
              const clicks = Math.abs(index - currentIndex);
              for (let i = 0; i < clicks; i++) {
                setTimeout(() => button.click(), i * 150);
              }
            }
          });

          dotsContainer.appendChild(dot);
        });

        slideshow.parentElement.appendChild(dotsContainer);

        function updateActiveDot() {
          const currentIndex = Array.from(slides).findIndex((slide) =>
            slide.style.transform.includes("translate3d(0"),
          );

          dotsContainer
            .querySelectorAll(".carousel-dot")
            .forEach((dot, idx) => {
              dot.classList.toggle("active", idx === currentIndex);
            });

          // Update slides
          slides.forEach((slide, idx) => {
            slide.classList.toggle("active", idx === currentIndex);
          });
        }

        slides.forEach((slide) => {
          const observer = new MutationObserver(updateActiveDot);
          observer.observe(slide, {
            attributes: true,
            attributeFilter: ["style"],
          });
        });

        updateActiveDot();
      });
    }

    initDots();

    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === 1 &&
            node.querySelector &&
            node.querySelector(".user-items-list-carousel__slides")
          ) {
            setTimeout(initDots, 100);
          }
        });
      });
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  });
 