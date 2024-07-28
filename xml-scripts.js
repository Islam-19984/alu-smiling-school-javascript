$(document).ready(function() {
    fetchQuotes();

    function fetchQuotes() {
        $.ajax({
            url: 'https://smileschool-api.alx-tools.com/xml/quotes',
            method: 'GET',
            dataType: 'xml',
            success: function(data) {
                // Hide the loader
                $('#quotes-section .loader').hide();
                
                // Show the quotes container
                $('#quotes-container').show();

                // Append quotes to the container
                $(data).find('quote').each(function() {
                    const text = $(this).find('text').text();
                    const author = $(this).find('author').text();
                    $('#quotes-container').append(`
                        <div class="quote">
                            <p>"${text}"</p>
                            <p>- ${author}</p>
                        </div>
                    `);
                });

                initializeCarousel();
            },
            error: function() {
                // Handle errors here
                $('#quotes-section .loader').hide();
                $('#quotes-container').html('<p>Unable to load quotes at the moment. Please try again later.</p>');
            }
        });
    }

    function initializeCarousel() {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.quote');
        const totalSlides = slides.length;

        function updateSlides() {
            slides.forEach((slide, index) => {
                slide.style.display = index === currentSlide ? 'block' : 'none';
            });
        }

        function moveCarousel(n) {
            currentSlide = (currentSlide + n + totalSlides) % totalSlides;
            updateSlides();
        }

        document.querySelector('.prev').addEventListener('click', () => moveCarousel(-1));
        document.querySelector('.next').addEventListener('click', () => moveCarousel(1));

        updateSlides();
    }
});

$(document).ready(function() {
    // Initialize filters
    fetchFilters();

    // Fetch courses when filters change
    $('#search-keywords').on('input', fetchCourses);
    $('#topic-filter').on('change', fetchCourses);
    $('#sort-filter').on('change', fetchCourses);

    function fetchFilters() {
        $.ajax({
            url: 'https://smileschool-api.alx-tools.com/xml/courses',
            method: 'GET',
            dataType: 'xml',
            success: function(data) {
                // Populate topic filter
                $(data).find('topics topic').each(function() {
                    const topic = $(this).text();
                    $('#topic-filter').append(`<option value="${topic}">${topic}</option>`);
                });

                // Populate sort filter
                $(data).find('sorts sort').each(function() {
                    const sort = $(this).text();
                    $('#sort-filter').append(`<option value="${sort}">${sort}</option>`);
                });

                // Set initial search value
                const initialSearch = $(data).find('q').text();
                $('#search-keywords').val(initialSearch);

                // Fetch initial courses
                fetchCourses();
            },
            error: function() {
                // Handle errors here
                alert('Unable to load filters at the moment. Please try again later.');
            }
        });
    }

    function fetchCourses() {
        const searchKeywords = $('#search-keywords').val();
        const topicFilter = $('#topic-filter').val();
        const sortFilter = $('#sort-filter').val();

        $.ajax({
            url: 'https://smileschool-api.alx-tools.com/xml/courses',
            method: 'GET',
            data: {
                q: searchKeywords,
                topic: topicFilter,
                sort: sortFilter
            },
            dataType: 'xml',
            beforeSend: function() {
                // Show loader
                $('#courses-section .loader').show();
                $('#courses-container').hide().empty();
            },
            success: function(data) {
                // Hide loader
                $('#courses-section .loader').hide();
                $('#courses-container').show();

                // Append courses to the container
                $(data).find('course').each(function() {
                    const thumbnail = $(this).find('thumbnail').text();
                    const title = $(this).find('title').text();
                    const subtitle = $(this).find('sub-title').text();
                    const duration = $(this).find('duration').text();
                    $('#courses-container').append(`
                        <div class="video-card">
                            <img src="${thumbnail}" alt="${title}">
                            <div class="video-info">
                                <h4>${title}</h4>
                                <p>${subtitle}</p>
                                <p>Duration: ${duration}</p>
                            </div>
                        </div>
                    `);
                });
            },
            error: function() {
                // Handle errors here
                $('#courses-section .loader').hide();
                $('#courses-container').html('<p>Unable to load courses at the moment. Please try again later.</p>');
            }
        });
    }
});
