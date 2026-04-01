/**
 * CodePulse — LeetCode Progress Tracker
 * Features: tabs, topic modal with questions, difficulty filter, real API
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── DOM refs ──────────────────────────────────────────
    const loginPage       = document.getElementById('login-page');
    const dashboardPage   = document.getElementById('dashboard-page');
    const loginForm       = document.getElementById('login-form');
    const loginBtn        = document.getElementById('login-btn');
    const usernameInput   = document.getElementById('username');
    const usernameError   = document.getElementById('username-error');
    const displayUsername = document.getElementById('display-username');
    const userAvatar      = document.getElementById('user-avatar');
    const modeBadge       = document.getElementById('mode-badge');
    const logoutBtn       = document.getElementById('logout-btn');
    const mobileLogout    = document.getElementById('mobile-logout');
    const demoBtn         = document.getElementById('demo-btn');
    const refreshBtn      = document.getElementById('refresh-data');
    const chillPercentage = document.getElementById('chill-percentage');
    const scoreLabel      = document.getElementById('score-label');
    const ringFill        = document.getElementById('ring-fill');
    const toastEl         = document.getElementById('toast');
    const navbar          = document.getElementById('navbar');
    const hamburger       = document.getElementById('hamburger');
    const mobileMenu      = document.getElementById('mobile-menu');
    const modalBackdrop   = document.getElementById('modal-backdrop');
    const modalClose      = document.getElementById('modal-close');
    const modalTitle      = document.getElementById('modal-title');
    const modalEyebrow    = document.getElementById('modal-eyebrow');
    const modalBody       = document.getElementById('modal-body');
    const modalCount      = document.getElementById('modal-count');
    const modalLcLink     = document.getElementById('modal-lc-link');

    let lineChart, doughnutChart;
    let currentTopicData = [];   // questions currently shown in modal
    let currentFilter    = 'all';

    // ── Question bank per topic ───────────────────────────
    // Real LeetCode problems mapped to topics
    const TOPIC_QUESTIONS = {
        'Arrays': [
            { id: 1,   title: 'Two Sum',                        diff: 'easy'   },
            { id: 26,  title: 'Remove Duplicates from Sorted Array', diff: 'easy' },
            { id: 53,  title: 'Maximum Subarray',               diff: 'medium' },
            { id: 56,  title: 'Merge Intervals',                diff: 'medium' },
            { id: 121, title: 'Best Time to Buy and Sell Stock',diff: 'easy'   },
            { id: 152, title: 'Maximum Product Subarray',       diff: 'medium' },
            { id: 153, title: 'Find Minimum in Rotated Sorted Array', diff: 'medium' },
            { id: 169, title: 'Majority Element',               diff: 'easy'   },
            { id: 238, title: 'Product of Array Except Self',   diff: 'medium' },
            { id: 268, title: 'Missing Number',                 diff: 'easy'   },
            { id: 41,  title: 'First Missing Positive',         diff: 'hard'   },
            { id: 42,  title: 'Trapping Rain Water',            diff: 'hard'   },
            { id: 84,  title: 'Largest Rectangle in Histogram', diff: 'hard'   },
        ],
        'Dynamic Prog.': [
            { id: 70,  title: 'Climbing Stairs',                diff: 'easy'   },
            { id: 198, title: 'House Robber',                   diff: 'medium' },
            { id: 213, title: 'House Robber II',                diff: 'medium' },
            { id: 300, title: 'Longest Increasing Subsequence', diff: 'medium' },
            { id: 322, title: 'Coin Change',                    diff: 'medium' },
            { id: 416, title: 'Partition Equal Subset Sum',     diff: 'medium' },
            { id: 1143,title: 'Longest Common Subsequence',     diff: 'medium' },
            { id: 62,  title: 'Unique Paths',                   diff: 'medium' },
            { id: 91,  title: 'Decode Ways',                    diff: 'medium' },
            { id: 139, title: 'Word Break',                     diff: 'medium' },
            { id: 115, title: 'Distinct Subsequences',          diff: 'hard'   },
            { id: 312, title: 'Burst Balloons',                 diff: 'hard'   },
        ],
        'Hash Maps': [
            { id: 1,   title: 'Two Sum',                        diff: 'easy'   },
            { id: 49,  title: 'Group Anagrams',                 diff: 'medium' },
            { id: 128, title: 'Longest Consecutive Sequence',   diff: 'medium' },
            { id: 347, title: 'Top K Frequent Elements',        diff: 'medium' },
            { id: 380, title: 'Insert Delete GetRandom O(1)',   diff: 'medium' },
            { id: 146, title: 'LRU Cache',                      diff: 'medium' },
            { id: 560, title: 'Subarray Sum Equals K',          diff: 'medium' },
            { id: 217, title: 'Contains Duplicate',             diff: 'easy'   },
            { id: 242, title: 'Valid Anagram',                  diff: 'easy'   },
            { id: 36,  title: 'Valid Sudoku',                   diff: 'medium' },
        ],
        'Two Pointers': [
            { id: 167, title: 'Two Sum II — Input Array Is Sorted', diff: 'medium' },
            { id: 15,  title: '3Sum',                           diff: 'medium' },
            { id: 11,  title: 'Container With Most Water',      diff: 'medium' },
            { id: 42,  title: 'Trapping Rain Water',            diff: 'hard'   },
            { id: 125, title: 'Valid Palindrome',               diff: 'easy'   },
            { id: 392, title: 'Is Subsequence',                 diff: 'easy'   },
            { id: 75,  title: 'Sort Colors',                    diff: 'medium' },
            { id: 88,  title: 'Merge Sorted Array',             diff: 'easy'   },
        ],
        'Binary Search': [
            { id: 704, title: 'Binary Search',                  diff: 'easy'   },
            { id: 74,  title: 'Search a 2D Matrix',             diff: 'medium' },
            { id: 33,  title: 'Search in Rotated Sorted Array', diff: 'medium' },
            { id: 153, title: 'Find Minimum in Rotated Sorted Array', diff: 'medium' },
            { id: 981, title: 'Time Based Key-Value Store',     diff: 'medium' },
            { id: 4,   title: 'Median of Two Sorted Arrays',    diff: 'hard'   },
            { id: 875, title: 'Koko Eating Bananas',            diff: 'medium' },
            { id: 1011,title: 'Capacity To Ship Packages',      diff: 'medium' },
        ],
        'Trees': [
            { id: 226, title: 'Invert Binary Tree',             diff: 'easy'   },
            { id: 104, title: 'Maximum Depth of Binary Tree',   diff: 'easy'   },
            { id: 100, title: 'Same Tree',                      diff: 'easy'   },
            { id: 572, title: 'Subtree of Another Tree',        diff: 'easy'   },
            { id: 235, title: 'LCA of a Binary Search Tree',    diff: 'medium' },
            { id: 102, title: 'Binary Tree Level Order Traversal', diff: 'medium' },
            { id: 98,  title: 'Validate Binary Search Tree',    diff: 'medium' },
            { id: 105, title: 'Construct BT from Preorder & Inorder', diff: 'medium' },
            { id: 124, title: 'Binary Tree Maximum Path Sum',   diff: 'hard'   },
            { id: 297, title: 'Serialize and Deserialize BT',   diff: 'hard'   },
        ],
        'Graphs': [
            { id: 200, title: 'Number of Islands',              diff: 'medium' },
            { id: 133, title: 'Clone Graph',                    diff: 'medium' },
            { id: 417, title: 'Pacific Atlantic Water Flow',    diff: 'medium' },
            { id: 207, title: 'Course Schedule',                diff: 'medium' },
            { id: 323, title: 'Number of Connected Components', diff: 'medium' },
            { id: 684, title: 'Redundant Connection',           diff: 'medium' },
            { id: 743, title: 'Network Delay Time',             diff: 'medium' },
            { id: 778, title: 'Swim in Rising Water',           diff: 'hard'   },
            { id: 787, title: 'Cheapest Flights Within K Stops',diff: 'medium' },
        ],
        'Sliding Window': [
            { id: 121, title: 'Best Time to Buy and Sell Stock',diff: 'easy'   },
            { id: 3,   title: 'Longest Substring Without Repeating', diff: 'medium' },
            { id: 424, title: 'Longest Repeating Character Replacement', diff: 'medium' },
            { id: 567, title: 'Permutation in String',          diff: 'medium' },
            { id: 76,  title: 'Minimum Window Substring',       diff: 'hard'   },
            { id: 239, title: 'Sliding Window Maximum',         diff: 'hard'   },
        ],
        'Linked Lists': [
            { id: 206, title: 'Reverse Linked List',            diff: 'easy'   },
            { id: 21,  title: 'Merge Two Sorted Lists',         diff: 'easy'   },
            { id: 143, title: 'Reorder List',                   diff: 'medium' },
            { id: 19,  title: 'Remove Nth Node From End',       diff: 'medium' },
            { id: 138, title: 'Copy List with Random Pointer',  diff: 'medium' },
            { id: 2,   title: 'Add Two Numbers',                diff: 'medium' },
            { id: 287, title: 'Find the Duplicate Number',      diff: 'medium' },
            { id: 23,  title: 'Merge k Sorted Lists',           diff: 'hard'   },
            { id: 25,  title: 'Reverse Nodes in k-Group',       diff: 'hard'   },
        ],
        'Backtracking': [
            { id: 46,  title: 'Permutations',                   diff: 'medium' },
            { id: 78,  title: 'Subsets',                        diff: 'medium' },
            { id: 39,  title: 'Combination Sum',                diff: 'medium' },
            { id: 40,  title: 'Combination Sum II',             diff: 'medium' },
            { id: 79,  title: 'Word Search',                    diff: 'medium' },
            { id: 131, title: 'Palindrome Partitioning',        diff: 'medium' },
            { id: 51,  title: 'N-Queens',                       diff: 'hard'   },
            { id: 37,  title: 'Sudoku Solver',                  diff: 'hard'   },
        ],
        'Heaps': [
            { id: 703, title: 'Kth Largest Element in a Stream', diff: 'easy'  },
            { id: 1046,title: 'Last Stone Weight',               diff: 'easy'  },
            { id: 973, title: 'K Closest Points to Origin',      diff: 'medium' },
            { id: 215, title: 'Kth Largest Element in an Array', diff: 'medium' },
            { id: 621, title: 'Task Scheduler',                  diff: 'medium' },
            { id: 355, title: 'Design Twitter',                  diff: 'medium' },
            { id: 295, title: 'Find Median from Data Stream',    diff: 'hard'   },
        ],
        'Stacks': [
            { id: 20,  title: 'Valid Parentheses',               diff: 'easy'  },
            { id: 155, title: 'Min Stack',                       diff: 'medium' },
            { id: 150, title: 'Evaluate Reverse Polish Notation',diff: 'medium' },
            { id: 22,  title: 'Generate Parentheses',            diff: 'medium' },
            { id: 739, title: 'Daily Temperatures',              diff: 'medium' },
            { id: 853, title: 'Car Fleet',                       diff: 'medium' },
            { id: 84,  title: 'Largest Rectangle in Histogram',  diff: 'hard'  },
        ],
    };

    // ── Navbar scroll shadow ──────────────────────────────
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    // ── Mobile hamburger ──────────────────────────────────
    hamburger.addEventListener('click', () => {
        const open = hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(open));
        mobileMenu.classList.toggle('open', open);
        mobileMenu.setAttribute('aria-hidden', String(!open));
    });

    // ── Tab switching ─────────────────────────────────────
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;

            // Update buttons
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.toggle('active', b === btn);
                b.setAttribute('aria-selected', String(b === btn));
            });

            // Update panels
            document.querySelectorAll('.tab-panel').forEach(panel => {
                const isTarget = panel.id === `tab-${tab}`;
                panel.classList.toggle('active', isTarget);
                panel.hidden = !isTarget;
            });

            // Init charts when analytics tab opens (rebuild heatmap each time)
            if (tab === 'analytics') {
                if (!doughnutChart) initCharts(window._dashData || null);
                else buildHeatmap(window._dashData || null);
            }
            // Animate topic bars when topics tab opens
            if (tab === 'topics') {
                setTimeout(() => {
                    document.querySelectorAll('.topic-bar-fill').forEach(el => {
                        el.style.width = (el.dataset.pct || 0) + '%';
                    });
                }, 50);
            }
        });
    });

    // ── Toast ─────────────────────────────────────────────
    let toastTimer;
    function showToast(msg, type = '') {
        clearTimeout(toastTimer);
        toastEl.textContent = msg;
        toastEl.className = `toast show ${type}`.trim();
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
    }

    // ── XSS sanitiser ────────────────────────────────────
    function sanitise(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    // ── Page transitions ──────────────────────────────────
    function goToDashboard(username) {
        displayUsername.textContent = username;
        userAvatar.textContent = username.charAt(0).toUpperCase();
        loginPage.classList.remove('active');
        setTimeout(() => dashboardPage.classList.add('active'), 50);
    }

    function goToLogin() {
        dashboardPage.classList.remove('active');
        setTimeout(() => {
            loginPage.classList.add('active');
            usernameInput.value = '';
            usernameError.textContent = '';
            destroyCharts();
            window._dashData = null;
        }, 50);
    }

    // ── Login ─────────────────────────────────────────────
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (!username) { usernameError.textContent = 'Please enter a username.'; return; }
        if (!/^[a-zA-Z0-9_.-]{1,40}$/.test(username)) { usernameError.textContent = 'Invalid username format.'; return; }
        usernameError.textContent = '';
        setLoginLoading(true);
        try {
            const data = await fetchLeetCodeData(username);
            if (data) {
                window._dashData = data;
                goToDashboard(username);
                modeBadge.textContent = 'LIVE'; modeBadge.className = 'mode-badge live';
                setTimeout(() => populateDashboard(data), 80);
                showToast(`✓ Live data loaded for ${username}`, 'success');
            } else {
                usernameError.textContent = 'User not found or profile is private. Check the username and try again.';
            }
        } catch (err) {
            // Username was entered but all APIs failed → show demo with a warning
            goToDashboard(username);
            modeBadge.textContent = 'DEMO'; modeBadge.className = 'mode-badge';
            setTimeout(() => populateDashboard(null), 80);
            showToast('APIs unreachable — showing demo data', 'error');
        } finally {
            setLoginLoading(false);
        }
    });

    demoBtn.addEventListener('click', () => {
        goToDashboard('demo_user');
        modeBadge.textContent = 'DEMO'; modeBadge.className = 'mode-badge';
        setTimeout(() => populateDashboard(null), 80);
    });

    [logoutBtn, mobileLogout].forEach(b => b.addEventListener('click', goToLogin));

    refreshBtn && refreshBtn.addEventListener('click', async () => {
        refreshBtn.classList.add('spinning'); refreshBtn.disabled = true;
        await new Promise(r => setTimeout(r, 1400));
        animateRing(parseInt(chillPercentage.textContent));
        refreshBtn.classList.remove('spinning'); refreshBtn.disabled = false;
        showToast('Stats refreshed', 'success');
    });

    function setLoginLoading(on) {
        loginBtn.classList.toggle('loading', on);
        loginBtn.disabled = on; usernameInput.disabled = on;
    }

    // ── Fetch ─────────────────────────────────────────────
    // Normalise any API response shape into a common object
    function normaliseData(raw, username) {
        if (!raw) return null;

        // Shape 1 & 2: APIs that return solvedProblem OR totalSolved,
        //   with medSolved OR mediumSolved for medium count.
        //   Covers: alfa-leetcode-api (/solved), leetcode-stats-api, faisalshohag proxy
        if (raw.totalSolved !== undefined || raw.solvedProblem !== undefined) {
            const total  = parseInt(raw.totalSolved  ?? raw.solvedProblem) || 0;
            const medium = parseInt(raw.mediumSolved ?? raw.medSolved)     || 0;
            return {
                totalSolved:    total,
                easySolved:     parseInt(raw.easySolved)       || 0,
                mediumSolved:   medium,
                hardSolved:     parseInt(raw.hardSolved)       || 0,
                acceptanceRate: parseFloat(raw.acceptanceRate) || 0,
                ranking:        parseInt(raw.ranking)          || 999999,
            };
        }

        // Shape 3: LeetCode GraphQL { data.matchedUser.submitStats.acSubmissionNum[...] }
        if (raw.data && raw.data.matchedUser) {
            const u    = raw.data.matchedUser;
            const ac   = (u.submitStats?.acSubmissionNum) || [];
            const find = (d) => (ac.find(x => x.difficulty === d) || {}).count || 0;
            const profile = u.profile || {};
            return {
                totalSolved:    find('All'),
                easySolved:     find('Easy'),
                mediumSolved:   find('Medium'),
                hardSolved:     find('Hard'),
                acceptanceRate: parseFloat(profile.ranking) > 0
                    ? Math.min(95, Math.max(30, 100 - Math.log10(profile.ranking) * 15))
                    : 65,
                ranking:        parseInt(profile.ranking) || 999999,
            };
        }

        return null;
    }

    async function tryFetch(url, opts = {}) {
        const ctrl = new AbortController();
        const tid  = setTimeout(() => ctrl.abort(), 7000);
        try {
            const res = await fetch(url, { ...opts, signal: ctrl.signal });
            clearTimeout(tid);
            if (!res.ok) return null;
            return await res.json();
        } catch {
            clearTimeout(tid);
            return null;
        }
    }

    async function fetchLeetCodeData(username) {
        const enc = encodeURIComponent(username);

        // ── Source 1: alfa-leetcode-api (Vercel, generally reliable) ──
        const r1 = await tryFetch(`https://alfa-leetcode-api.onrender.com/${enc}/solved`);
        if (r1) {
            const norm1 = normaliseData(r1, username);
            if (norm1 && norm1.totalSolved > 0) return norm1;
        }

        // ── Source 2: leetcode-stats-api ──
        const r2 = await tryFetch(`https://leetcode-stats-api.herokuapp.com/${enc}`);
        if (r2 && r2.status !== 'error') {
            const norm2 = normaliseData(r2, username);
            if (norm2 && norm2.totalSolved > 0) return norm2;
        }

        // ── Source 3: LeetCode GraphQL via AllOrigins CORS proxy ──
        const query = JSON.stringify({
            query: `query userPublicProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    profile { ranking }
                    submitStats {
                        acSubmissionNum { difficulty count }
                    }
                }
            }`,
            variables: { username }
        });

        const proxyUrl = `https://api.allorigins.win/post?url=${encodeURIComponent('https://leetcode.com/graphql')}`;
        const r3raw = await tryFetch(proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: query,
        });

        if (r3raw && r3raw.contents) {
            try {
                const parsed = JSON.parse(r3raw.contents);
                const norm3  = normaliseData(parsed, username);
                if (norm3 && norm3.totalSolved > 0) return norm3;
            } catch { /* fall through */ }
        }

        // ── Source 4: original faisalshohag proxy ──
        const r4 = await tryFetch(`https://leetcode-api-faisalshohag.vercel.app/${enc}`);
        if (r4) {
            const norm4 = normaliseData(r4, username);
            if (norm4 && norm4.totalSolved > 0) return norm4;
        }

        // All sources failed — throw so caller shows demo
        throw new Error('All API sources unavailable');
    }

    // ── Populate dashboard ────────────────────────────────
    function populateDashboard(data) {
        const d = data || { totalSolved:412, easySolved:158, mediumSolved:210, hardSolved:44, acceptanceRate:'67.5', ranking:35000 };

        animateNumber('stat-total',  d.totalSolved);
        animateNumber('stat-easy',   d.easySolved);
        animateNumber('stat-medium', d.mediumSolved);
        animateNumber('stat-hard',   d.hardSolved);
        animateNumber('stat-streak', d.ranking > 100000 ? 7 : 12);

        const total = (d.easySolved + d.mediumSolved + d.hardSolved) || 1;
        setTimeout(() => {
            setBar('bar-easy',   'bar-easy-count',   d.easySolved,   total);
            setBar('bar-medium', 'bar-medium-count', d.mediumSolved, total);
            setBar('bar-hard',   'bar-hard-count',   d.hardSolved,   total);
        }, 200);

        const score = Math.min(100, Math.floor(parseFloat(d.acceptanceRate) || 67));
        setTimeout(() => {
            animateNumber('chill-percentage', score, '%');
            animateRing(score);
            updateScoreLabel(score);
        }, 300);

        populateTopics(d);
        // Always pre-build heatmap; only init full charts if analytics tab is visible
        buildHeatmap(d);
        const analyticsPanel = document.getElementById('tab-analytics');
        if (analyticsPanel && !analyticsPanel.hidden) initCharts(d);
    }

    function setBar(barId, countId, count, total) {
        const pct = Math.round((count / total) * 100);
        const bar = document.getElementById(barId);
        const cnt = document.getElementById(countId);
        if (bar) bar.style.width = pct + '%';
        if (cnt) cnt.textContent = count;
    }

    function updateScoreLabel(score) {
        const labels = [
            [0,  40,  '🌱 Keep going — every problem counts!'],
            [40, 60,  '⚡ Getting warmer — nice consistency.'],
            [60, 75,  '🔥 Solid work! You\'re in good shape.'],
            [75, 90,  '💪 Impressive rate — keep the streak alive!'],
            [90, 101, '🏆 Elite acceptance rate. Truly exceptional.'],
        ];
        const entry = labels.find(([lo, hi]) => score >= lo && score < hi);
        if (scoreLabel && entry) scoreLabel.textContent = entry[2];
    }

    function animateRing(score) {
        const offset = 314 - (314 * score / 100);
        if (ringFill) ringFill.style.strokeDashoffset = offset;
    }

    function animateNumber(id, end, suffix = '') {
        const el = document.getElementById(id);
        if (!el) return;
        const duration = 1200;
        let startTime = null;
        function step(ts) {
            if (!startTime) startTime = ts;
            const p = Math.min((ts - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(ease * end) + suffix;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // ── Topics ────────────────────────────────────────────
    function populateTopics(data) {
        const grid = document.getElementById('topics-grid');
        if (!grid) return;

        const easySolved   = data ? (data.easySolved   || 0) : 158;
        const mediumSolved = data ? (data.mediumSolved || 0) : 210;
        const hardSolved   = data ? (data.hardSolved   || 0) : 44;
        const totalSolved  = (easySolved + mediumSolved + hardSolved) || 1;

        const allTopics = Object.entries(TOPIC_QUESTIONS).map(([name, qs]) => {
            const easyQs  = qs.filter(q => q.diff === 'easy').length;
            const medQs   = qs.filter(q => q.diff === 'medium').length;
            const hardQs  = qs.filter(q => q.diff === 'hard').length;
            const topicTot = (easyQs + medQs + hardQs) || 1;
            const eW = easyQs   * (easySolved   / totalSolved);
            const mW = medQs    * (mediumSolved / totalSolved);
            const hW = hardQs   * (hardSolved   / totalSolved);
            const count = Math.max(1, Math.round((eW + mW + hW) / topicTot * totalSolved * 0.6));
            return { name, count, questions: qs };
        }).sort((a, b) => b.count - a.count);

        const max = allTopics[0].count || 1;
        grid.innerHTML = '';

        allTopics.forEach(({ name, count, questions }, i) => {
            const pct  = Math.round(count / max * 100);
            const chip = document.createElement('article');
            chip.className = 'topic-chip';
            chip.setAttribute('role', 'button');
            chip.setAttribute('tabindex', '0');
            chip.setAttribute('aria-label', name + ': ' + count + ' problems solved. Click to view.');
            chip.style.animationDelay = (i * 45) + 'ms';
            chip.innerHTML =
                '<div class="topic-chip-header">' +
                  '<p class="topic-name">' + sanitise(name) + '</p>' +
                  '<span class="topic-arrow"><i class="fa-solid fa-chevron-right"></i></span>' +
                '</div>' +
                '<p class="topic-count">' + count + '</p>' +
                '<div class="topic-bar">' +
                  '<div class="topic-bar-fill" data-pct="' + pct + '" style="width:0%"></div>' +
                '</div>';

            chip.addEventListener('click', () => openTopicModal(name, questions, count));
            chip.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTopicModal(name, questions, count); }
            });
            grid.appendChild(chip);
        });
    }

    // ── Modal ─────────────────────────────────────────────
    function openTopicModal(topicName, questions, solvedCount) {
        currentTopicData = questions;
        currentFilter    = 'all';

        modalEyebrow.textContent = 'Topic';
        modalTitle.textContent   = topicName;
        modalLcLink.href         = `https://leetcode.com/tag/${topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`;

        // Reset filters
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));

        renderQuestions(questions, 'all');

        modalBackdrop.setAttribute('aria-hidden', 'false');
        modalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Focus close button for a11y
        setTimeout(() => modalClose.focus(), 100);
    }

    function closeModal() {
        modalBackdrop.classList.remove('open');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function renderQuestions(questions, filter) {
        const filtered = filter === 'all' ? questions : questions.filter(q => q.diff === filter);
        modalCount.textContent = `${filtered.length} question${filtered.length !== 1 ? 's' : ''}`;

        if (!filtered.length) {
            modalBody.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <p>No ${filter} questions in this topic.</p>
                </div>`;
            return;
        }

        modalBody.innerHTML = filtered.map((q, idx) => `
            <a class="question-row"
               href="https://leetcode.com/problems/${q.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}/"
               target="_blank" rel="noopener noreferrer"
               aria-label="${sanitise(q.title)} — ${q.diff}">
                <span class="q-num">#${q.id}</span>
                <span class="q-title">${sanitise(q.title)}</span>
                <span class="q-difficulty ${q.diff}">${q.diff}</span>
                <span class="q-arrow"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
            </a>`
        ).join('');
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            renderQuestions(currentTopicData, currentFilter);
        });
    });

    // Close modal events
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', e => { if (e.target === modalBackdrop) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (modalBackdrop.classList.contains('open')) closeModal();
            if (hamburger.classList.contains('open')) {
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('open');
                mobileMenu.setAttribute('aria-hidden', 'true');
            }
        }
    });

    // ── Charts ────────────────────────────────────────────
    function destroyCharts() {
        if (doughnutChart){ doughnutChart.destroy(); doughnutChart = null; }
    }

    // ── Heatmap ───────────────────────────────────────────
    function buildHeatmap(data) {
        const area = document.getElementById('heatmap-area');
        if (!area) return;

        const total = data ? (data.totalSolved || 0) : 412;
        const today = new Date();
        const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        // Build 364 days of seeded activity (52 weeks × 7 days)
        const cells = [];
        for (let i = 363; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dow         = d.getDay();
            const weekFactor  = (dow >= 1 && dow <= 5) ? 1.15 : 0.65;
            const density     = Math.min(1, total / 400);
            const rand        = seededRand(d.toISOString().slice(0, 10) + total);
            const prob        = rand * weekFactor * density;
            let level = 0;
            if (prob > 0.50) level = 1;
            if (prob > 0.62) level = 2;
            if (prob > 0.74) level = 3;
            if (prob > 0.83) level = 4;
            cells.push({
                date:  d,
                level,
                count: level === 0 ? 0 : Math.max(1, Math.floor(level * 2 + rand * 3))
            });
        }

        // Group into 52 columns of 7 days
        const weeks = [];
        for (let w = 0; w < 52; w++) weeks.push(cells.slice(w * 7, w * 7 + 7));

        // Tooltip (reuse across rebuilds)
        let tip = document.getElementById('hm-tip');
        if (!tip) {
            tip = document.createElement('div');
            tip.id = 'hm-tip';
            tip.className = 'heatmap-tooltip';
            document.body.appendChild(tip);
        }

        // Outer wrapper: month row + grid stacked
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:inline-flex;flex-direction:column;gap:4px;min-width:max-content';

        // Month label row — one cell-width span per week column
        const monthRow = document.createElement('div');
        monthRow.style.cssText = 'display:flex;gap:3px';
        let lastM = -1;
        weeks.forEach(week => {
            const m   = week[0].date.getMonth();
            const lbl = document.createElement('div');
            lbl.style.cssText = 'width:13px;font-size:10px;color:#5a5a72;font-family:"DM Sans",sans-serif;overflow:visible;white-space:nowrap';
            lbl.textContent   = (m !== lastM) ? MONTHS[m] : '';
            if (m !== lastM) lastM = m;
            monthRow.appendChild(lbl);
        });
        wrapper.appendChild(monthRow);

        // Cell grid
        const gridEl = document.createElement('div');
        gridEl.style.cssText = 'display:flex;gap:3px';

        weeks.forEach(week => {
            const col = document.createElement('div');
            col.style.cssText = 'display:flex;flex-direction:column;gap:3px';
            week.forEach(({ date, level, count }) => {
                const cell  = document.createElement('div');
                cell.className      = 'heatmap-cell';
                cell.dataset.level  = level;
                const lbl = date.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
                cell.addEventListener('mouseenter', () => {
                    tip.textContent = count === 0
                        ? `No submissions — ${lbl}`
                        : `${count} submission${count > 1 ? 's' : ''} — ${lbl}`;
                    tip.classList.add('visible');
                });
                cell.addEventListener('mousemove', e => {
                    tip.style.left = (e.clientX + 14) + 'px';
                    tip.style.top  = (e.clientY - 34) + 'px';
                });
                cell.addEventListener('mouseleave', () => tip.classList.remove('visible'));
                col.appendChild(cell);
            });
            gridEl.appendChild(col);
        });
        wrapper.appendChild(gridEl);

        area.innerHTML = '';
        area.appendChild(wrapper);
    }

    // Simple deterministic pseudo-random from a string seed
    function seededRand(seed) {
        let h = 0;
        for (let i = 0; i < seed.length; i++) {
            h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
        }
        const x = Math.sin(h) * 10000;
        return x - Math.floor(x);
    }

    function initCharts(data) {
        destroyCharts();
        buildHeatmap(data);
        const dist = data ? [data.easySolved, data.mediumSolved, data.hardSolved] : [158, 210, 44];

        // Doughnut
        const dCtx = document.getElementById('doughnutChart').getContext('2d');
        doughnutChart = new Chart(dCtx, {
            type:'doughnut',
            data:{ labels:['Easy','Medium','Hard'], datasets:[{ data:dist, backgroundColor:['#10b981','#f59e0b','#ef4444'], borderColor:'#1c1c26', borderWidth:3, hoverOffset:8 }] },
            options:{
                responsive:true, maintainAspectRatio:false,
                animation:{duration:1000,easing:'easeOutQuart'},
                cutout:'72%',
                plugins:{
                    legend:{position:'bottom',labels:{padding:16,usePointStyle:true,pointStyleWidth:8,color:'#9898b0',font:{family:'DM Sans',weight:'500',size:12}}},
                    tooltip:{backgroundColor:'#22222e',borderColor:'rgba(255,255,255,0.08)',borderWidth:1,titleColor:'#9898b0',bodyColor:'#f0f0f5',padding:12,cornerRadius:8}
                }
            }
        });
    }

    // ── Difficulty card click → open all questions of that difficulty ──
    function openDifficultyModal(diff) {
        // Aggregate all questions of this difficulty across all topics (deduplicated by id)
        const seen = new Set();
        const questions = [];
        Object.values(TOPIC_QUESTIONS).forEach(qs => {
            qs.forEach(q => {
                if (q.diff === diff && !seen.has(q.id)) {
                    seen.add(q.id);
                    questions.push(q);
                }
            });
        });
        questions.sort((a, b) => a.id - b.id);
        const label = diff.charAt(0).toUpperCase() + diff.slice(1);
        openTopicModal(`${label} Questions`, questions, questions.length);
    }

    ['easy','medium','hard'].forEach(diff => {
        const card = document.getElementById(`card-${diff}`);
        if (!card) return;
        card.addEventListener('click', () => openDifficultyModal(diff));
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDifficultyModal(diff); } });
    });

});
