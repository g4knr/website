console.log("production - home");

/*
*****
process
*****
*/

/* position the process number */
function processPosition() {
	const processNumber = document.querySelector(".progress-number__contain");
	const processCards = document.querySelectorAll(
		".process__main .card.is--process"
	);

	const processNumberHeight = processNumber.offsetHeight / 2,
		marginTop = processCards[0].offsetHeight / 2 - processNumberHeight,
		marginBottom =
			processCards[processCards.length - 1].offsetHeight / 2 -
			processNumberHeight;

	processNumber.style.marginTop = `${marginTop}px`;
	processNumber.style.marginBottom = `${marginBottom}px`;
}

/* process cards and number gsap */
function processCards() {
	// get a reference to the first progress number and it's height
	const progressNumber = document.querySelector(".progress-number"),
		height = progressNumber.offsetHeight;

	// get a reference to all process cards and loop through them
	const processCards = document.querySelectorAll(".card.is--process");
	processCards.forEach((processCard, index) => {
		// define the cards animation trigger
		const cards = gsap.timeline({
			scrollTrigger: {
				trigger: processCard,
				start: "top center",
				end: "center center",
				scrub: 1
			}
		});

		// define the cards animation
		cards.fromTo(
			processCard,
			{ opacity: "10%" },
			{ opacity: "100%", duration: 1 }
		);

		cards.to(progressNumber, {
			marginTop: `${-index * height}px`,
			duration: 1
		});
	});
}

/* ********** */

/*
*****
projects
*****
*/

/* function to hide or show the iframe loading animation */
function iframeChange(iframe, loaded) {
	// get a reference to the w-embed and loading wrapper
	const wEmbed = iframe.closest(".w-embed"),
		loadingWrapper = wEmbed
			.closest(".project__iframe-wrapper")
			.querySelector(".loading__wrapper");

	// determine opacity based on whether loaded or loading
	const loadingOpacity = loaded ? 0 : 1;
	loadingWrapper.style.opacity = loadingOpacity;
}

// function to set the iframe source
function setIframeSource(projectTab) {
	// find the current slide
	const currentSlide = projectTab.closest(".splide__slide"),
		iframe = currentSlide.querySelector("iframe");

	// set the iframe source
	iframeChange(iframe, false);
	iframe.onload = iframeChange(iframe, true);
	iframe.src = projectTab.href;
}

// function to hide or show url links
function showProjectControls(projectTab) {
	const moveBy =
			projectTab.getAttribute("data-tab-type") === "design" ? "100%" : "0%",
		currentSlide = projectTab.closest(".splide__slide"),
		projectControls = currentSlide.querySelector(".project__link-wrapper");

	projectControls.style.transform = `translate(0px, ${moveBy})`;
}

/* function to change iframe source when clicking project tabs */
function projectTabs() {
	// get a reference to all tabs and loop through them
	const projectTabs = document.querySelectorAll(".project__iframe-tab");

	// run functions for each project tab
	projectTabs.forEach((projectTab, index) => {
		if (index === 0) {
			setIframeSource(projectTab);
		}

		projectTab.onclick = (event) => {
			// prevent the link from opening and call the project tab function
			event.preventDefault();
			setIframeSource(projectTab);
			showProjectControls(projectTab);
			if (projectTab.getAttribute("data-tab-type") === "design") {
				const iframeWrapper = projectTab
					.closest(".splide__slide")
					.querySelector(".project-iframe");
				iframeWrapperResize(iframeWrapper, "auto");
				iframeEmbedResize(iframeWrapper, "auto");
			}
		};
	});
}

function iframeWrapperResize(iframeWrapper, device) {
	if (device === "mobile") {
		iframeWrapper.style.height = `100%`;
		iframeWrapper.style.width = `${(iframeWrapper.offsetHeight / 16) * 9}px`;
	} else if (device === "desktop") {
		iframeWrapper.style.width = `100%`;
		iframeWrapper.style.height = `${(iframeWrapper.offsetWidth / 16) * 9}px`;
	} else if (device === "auto") {
		iframeWrapper.style.height = `100%`;
		iframeWrapper.style.width = `100%`;
	}
}

function iframeEmbedResize(iframeWrapper, iconType) {
	const iframeEmbed = iframeWrapper.querySelector(".project__iframe"),
		deviceSizes = {
			mobile: 420,
			desktop: 1440,
			auto: iframeWrapper.offsetWidth
		};
	let scale = deviceSizes[iconType] / iframeWrapper.offsetWidth;
	iframeEmbed.style.width = `${100 * scale}%`;
	iframeEmbed.style.height = `${100 * scale}%`;
	iframeEmbed.style.transform = `scale(${1 / scale})`;
}

function projectDevices() {
	const projectDevices = document.querySelectorAll("[data-iframe-device]");

	projectDevices.forEach((projectDevice) => {
		const iconType = projectDevice.getAttribute("data-iframe-device"),
			iframeWrapper = projectDevice
				.closest(".project__iframe-wrapper")
				.querySelector(".project-iframe");

		projectDevice.onclick = () => {
			iframeWrapperResize(iframeWrapper, iconType);
			iframeEmbedResize(iframeWrapper, iconType);
		};
	});
}

/* function to create the project slider */
function projectSlider() {
	// define the slider and options
	const projectSplide = new Splide(".splide", {
		gap: "2em",
		speed: 350,
		easing: "cubic-bezier(.165, .84, .44, 1)"
	});

	// mount the slider
	projectSplide.mount();

	// when a slide becomes active
	// remove the src attribute from the previous slide's iframe
	// add the src attribute to the current slide's iframe
	function projectChange(splide, active) {
		// get a reference to the current slide and it's iframe
		const currentSlide = splide.slide,
			iframe = currentSlide.querySelector("iframe");

		// if the slide is active
		if (active) {
			// get the design link and set the iframe's src
			const projectTab = currentSlide.querySelector(".project__iframe-tab");
			setIframeSource(projectTab);
		} else {
			iframe.removeAttribute("src");
			iframeChange(iframe, false);
		}
	}

	projectSplide.on("inactive", (splide) => {
		projectChange(splide, false);
	});

	projectSplide.on("active", (splide) => {
		projectChange(splide, true);
	});
}

/* tags */
function projectTags() {
	// get a reference to all the tag lists and loop through them
	const tagLists = document.querySelectorAll(".project__tags-list");
	tagLists.forEach((tagList) => {
		// get a reference to the current list of tags and the tag element
		const currentList = tagList.nextElementSibling,
			placeholderTag = currentList.querySelector(".tag");

		// create an array from the string and sort it alphabetically
		tagList = tagList.textContent.split(", ").reverse();

		// loop through the array of tags
		tagList.forEach((tagText) => {
			// clone the tag and change its text
			const tag = placeholderTag.cloneNode(true);
			tag.querySelector("h4").textContent = tagText;
			// append the tag as the first child
			currentList.prepend(tag);
		});
	});

	// get a reference to all collaborator tags and loop through them
	const collaboratorTags = document.querySelectorAll(".is--collaborator");
	collaboratorTags.forEach((collaboratorTag) => {
		// determine whether to continue
		if (collaboratorTag.classList.contains("w-condition-invisible")) {
			collaboratorTag.remove();
		}

		// find the collaborator name
		const collaboratorName = collaboratorTag.querySelector(".tag__collaborator")
			.textContent;

		// determine and set the collaborator link
		const collaboratorLink =
			collaboratorName === "RCCO"
				? "https://rcco.uk"
				: collaboratorName === "Capri"
				? "https://wearecapri.com/"
				: "#";
		collaboratorTag.href = `${collaboratorLink}?ref=g4knr`;
		collaboratorTag.setAttribute("target", "_blank");

		// function to wrap the collaborator name in a span with dynamic class
		$(collaboratorTag).html(function (_, html) {
			const replace = new RegExp(collaboratorName, "g");
			return html.replace(
				replace,
				`<span class="text-style-${collaboratorName
					.replace(/\s+/g, "-")
					.toLowerCase()}">${collaboratorName}</span>`
			);
		});
	});
}

/* testimonials */
function projectTestimonials() {
	// get a reference to the testimonial destinations
	const testimonialDestinations = document.querySelectorAll(
		".project__testimonial-wrapper"
	);
	// get a reference to all the testimonials and loop through them
	const testimonials = document.querySelectorAll(
		".project-testimonials__wrapper .testimonial"
	);

	testimonials.forEach((testimonial, index) => {
		testimonialDestinations[index].append(testimonial);
	});
}

/* ********** */

/*
*****
site prep functions
*****
*/

function homePrep() {
	processPosition();
	processCards();
	projectTabs();
	projectDevices();
	projectSlider();
	projectTags();
	projectTestimonials();
}

if (document.readyState !== "loading") {
	// document is already ready
	homePrep();
} else {
	document.addEventListener("DOMContentLoaded", () => {
		// wait for document to be ready
		homePrep();
	});
}

/* ********** */
