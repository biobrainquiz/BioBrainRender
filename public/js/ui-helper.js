const BioBrainUI = {
    // Shared Progress Bar HTML
    progressHTML: `
        <div style="width: 100%; background: #e2e8f0; border-radius: 10px; overflow: hidden; margin-top: 15px;">
            <div id="swal-progress-bar" style="width: 0%; height: 12px; background: #3b82f6; transition: width 0.4s ease-out;"></div>
        </div>
    `,

    // Starts the SweetAlert and returns the interval ID
    showLoading(title, text) {
        let progress = 0;
        Swal.fire({
            title: title,
            html: `<p style="color: #64748b;">${text}</p>` + this.progressHTML,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
                this.interval = setInterval(() => {
                    if (progress < 90) {
                        progress += Math.random() * 12;
                        if (progress > 90) progress = 90;
                        const bar = document.getElementById('swal-progress-bar');
                        if (bar) bar.style.width = progress + '%';
                    }
                }, 600);
            }
        });
    },

    finish() {
        clearInterval(this.interval);
        const bar = document.getElementById('swal-progress-bar');
        if (bar) bar.style.width = '100%';
    },

    error(title, message) {
        clearInterval(this.interval);
        Swal.fire({ icon: 'error', title: title, text: message });
    },

    success(title, message) {
        Swal.fire({ icon: 'success', title: title, text: message, timer: 2000, showConfirmButton: false });
    }
};