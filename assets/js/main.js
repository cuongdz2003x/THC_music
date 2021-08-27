const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = 'THC_PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: '뱅뱅뱅 (BANG BANG BANG)',
            singer: 'BIGBANG',
            path: './assets/music/BIGBANG - 뱅뱅뱅 (BANG BANG BANG) M-V.mp3',
            image: './assets/image/img1.jpg'
        },
        {
            name: 'HARU HARU(하루하루)',
            singer: 'BIGBANG',
            path: './assets/music/BIGBANG - HARU HARU(하루하루) M-V.mp3',
            image: './assets/image/img2.jpg'
        },
        {
            name: 'RỒI TỚI LUÔN',
            singer: 'Nal',
            path: './assets/music/Rồi Tới Luôn - Nal (MV Audio Lyric).mp3',
            image: './assets/image/img3.jpg'
        },
        {
            name: 'NƠI NÀY CÓ ANH',
            singer: 'SƠN TÙNG M-TP',
            path: './assets/music/NƠI NÀY CÓ ANH - OFFICIAL MUSIC VIDEO - SƠN TÙNG M-TP.mp3',
            image: './assets/image/img4.jpg'
        },
        {
            name: 'HÃY TRAO CHO ANH',
            singer: 'SƠN TÙNG M-TP ft. Snoop Dogg',
            path: './assets/music/SƠN TÙNG M-TP - HÃY TRAO CHO ANH ft. Snoop Dogg - Official MV.mp3',
            image: './assets/image/img5.jpg'
        },
        {
            name: 'SÓNG GIÓ',
            singer: 'K-ICM x JACK',
            path: './assets/music/SÓNG GIÓ - K-ICM x JACK - OFFICIAL MUSIC VIDEO.mp3',
            image: './assets/image/img6.jpg'
        },
        {
            name: 'CHIỀU THU HỌA BÓNG NÀNG',
            singer: 'DATKAA x QT BEATZ',
            path: './assets/music/CHIỀU THU HỌA BÓNG NÀNG - DATKAA x QT BEATZ - OFFICIAL MUSIC VIDEO.mp3',
            image: './assets/image/img7.jpg'
        },
        {
            name: 'HẠ CÒN VƯƠNG NẮNG',
            singer: 'DATKAA x KIDO x Prod',
            path: './assets/music/HẠ CÒN VƯƠNG NẮNG - DATKAA x KIDO x Prod. QT BEATZ [OFFICIAL MUSIC VIDEO].mp3',
            image: './assets/image/img8.jpg'
        },
        {
            name: 'CÔ ĐƠN DÀNH CHO AI',
            singer: 'Lee Ken x Nal',
            path: './assets/music/♬Lofi Lyrics- Cô đơn dành cho ai - Lee Ken x Nal.mp3',
            image: './assets/image/img9.jpg'
        },
        {
            name: 'THƯƠNG THẦM',
            singer: 'NB3 Hoài Bảo x Freak D',
            path: './assets/music/Thương Thầm (Lofi Ver.) - NB3 Hoài Bảo x Freak D.mp3',
            image: './assets/image/img10.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}');">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Xử lí phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth / cdWidth; 
        };

        // Xử lí khi click play bài hát
        playBtn.onclick = function() {
            if (_this.isPlaying) {
            audio.pause();
            } else {
            audio.play();
            };
        };

        // Khi song được play 
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        };

        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();

        };

        // Khi tiến độ bài hát thay đổi 
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            };
        };

        // Xử lí khi tua song 
        progress.oninput = function(e) {
            // từ số phần trăm của giây convert sang giây
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        };

        // Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
              } else {
                _this.prevSong();
            }
            audio.play()
            _this.render();
            _this.scrollToActiveSong();
        };

        // Xử lí bật / tắt random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        };

        // Xử lí lặp lại một song 
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };

        // Xử lí next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            };
        };

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".option")) {
                // Xử lý khi click vào song
                // Handle when clicking on the song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                };

                // Xử lý khi click vào song option
                // Handle when clicking on the song option
                if (e.target.closest(".option")) {
                };
            };
        };
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 200);
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        };
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lí các sự kiện (DOM events)
        this.handleEvent();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        
        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
};

app.start();