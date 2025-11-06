$(function () {

    // Initialize all elements with data-pan-zoom="true"
    $('[data-pan-zoom="true"]').each(function () {
        initPanZoom($(this));
    });

    function initPanZoom($editor) {
        let $img = $editor.find('img'),
            scale = 1,
            pos = { x: 0, y: 0 },
            isDragging = false,
            start = { x: 0, y: 0 };

        // Wait until image is loaded so we can get natural size
        $img.on('load', function () {
            setup();
        });

        if ($img[0].complete) setup(); // in case it's already loaded

        function setup() {
            const editorW = $editor.width(),
                editorH = $editor.height(),
                imgW = $img.width(),
                imgH = $img.height();

            // Compute minimum scale so the image always covers at least the container
            const minScale = Math.min(editorW / imgW, editorH / imgH);

            // --- Drag to move ---
            $editor.on('mousedown', function (e) {
                e.preventDefault();
                isDragging = true;
                start.x = e.clientX - pos.x;
                start.y = e.clientY - pos.y;
                $editor.css('cursor', 'grabbing');
            });

            $(document).on('mouseup', function () {
                isDragging = false;
                $editor.css('cursor', 'grab');
            });

            $(document).on('mousemove', function (e) {
                if (!isDragging) return;
                pos.x = e.clientX - start.x;
                pos.y = e.clientY - start.y;
                updateTransform();
            });

            // --- Mouse wheel zoom ---
            $editor.on('wheel', function (e) {
                e.preventDefault();
                let delta = e.originalEvent.deltaY > 0 ? -0.1 : 0.1;
                scale += delta;
                scale = Math.min(Math.max(minScale, scale), 5); // limit zoom
                updateTransform();
            });

            // --- Apply transform ---
            function updateTransform() {
                $img.css('transform', `translate(${pos.x}px, ${pos.y}px) scale(${scale})`);
            }

            // --- Initial styles ---
            $editor.css({
                overflow: 'hidden',
                position: 'relative',
                cursor: 'grab'
            });
            $img.css({
                transformOrigin: 'center center',
                userSelect: 'none',
                pointerEvents: 'none',
                transition: 'transform 0s'
            });
        }
    }

});
