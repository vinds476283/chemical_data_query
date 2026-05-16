/*
MIT License

Copyright (c) 2026 [vinds](https://y.vinds.top)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
document.addEventListener('DOMContentLoaded', () => {
    const a = document.body;
    const b = document.getElementById('b');
    const c = document.getElementById('c');
    const d = document.getElementById('d');
    const e = document.getElementById('f');
    const f = document.getElementById('g');
    let g = [];
    let h = [];

    const i = (j) => {
        if (j === undefined || j === null) return '';
        let k = String(j);
        k = k.replace(/<[^>]*>/g, '');
        k = k.replace(/[~_]/g, '');
        k = k.replace(/[\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089]/g, (l) => {
            const m = {
                '\u2080': '0',
                '\u2081': '1',
                '\u2082': '2',
                '\u2083': '3',
                '\u2084': '4',
                '\u2085': '5',
                '\u2086': '6',
                '\u2087': '7',
                '\u2088': '8',
                '\u2089': '9'
            };
            return m[l] || l;
        });
        k = k.toLowerCase();
        return k;
    };

    function normalizeK(kStr) {
        if (!kStr) return '';
        let str = i(kStr);
        const match = str.match(/([\d\.]+)\s*[×x]\s*10([-\d]+)/i);
        if (match) {
            let base = parseFloat(match[1]);
            let exp = parseInt(match[2]);
            if (!isNaN(base) && !isNaN(exp)) {
                return (base * Math.pow(10, exp)).toExponential();
            }
        }
        return str;
    }

    const n = (o, p) => {
        const q = i(o);
        const r = i(p);
        return q.includes(r);
    };

    const matchesScientificNotation = (kValStr, userInput) => {
        const sciRegex = /([\d\.]+)e([+-]?\d+)/i;
        const match = userInput.match(sciRegex);
        if (!match) return false;

        let exp = match[2];
        if (exp.startsWith('+')) exp = exp.slice(1);

        const form1 = `10${exp}`;
        const form2 = `10^${exp}`;
        if (kValStr.includes('~')) {
            const parts = kValStr.split('~');
            return parts.some(part => part.includes(form1) || part.includes(form2));
        }

        return kValStr.includes(form1) || kValStr.includes(form2);
    };

    const s = (t) => {
        const u = i(t);
        if (!u) {
            h = [...g];
        } else {
            h = g.filter(v => {
                const chem = i(v.chem);
                const en = i(v.en);
                const zh = i(v.zh);
                const type = i(v.type);
                const series = i(v.series);
                const temp = i(v.T);
                const kVal = i(v.K);
                const pk = i(v.pK);

                if (chem.includes(u)) return true;
                if (en.includes(u)) return true;
                if (zh.includes(u)) return true;
                if (type.includes(u)) return true;
                if (series.includes(u)) return true;
                if (temp.includes(u)) return true;
                if (pk.includes(u)) return true;

                if (matchesScientificNotation(kVal, u)) return true;
                if (kVal.includes(u)) return true;

                return false;
            });
        }
        if (h.length === 0) {
            f.style.display = 'block';
            e.innerHTML = '';
        } else {
            f.style.display = 'none';
            const ad = document.createDocumentFragment();
            for (let ae = 0; ae < h.length; ae++) {
                const af = h[ae];
                const ag = document.createElement('tr');
                const ah = document.createElement('td');
                ah.innerHTML = af.chem || '';
                ag.appendChild(ah);
                const ai = document.createElement('td');
                ai.textContent = af.en || '';
                ag.appendChild(ai);
                const aj = document.createElement('td');
                aj.textContent = af.zh || '';
                ag.appendChild(aj);
                const ak = document.createElement('td');
                ak.textContent = af.type || '';
                ag.appendChild(ak);
                const al = document.createElement('td');
                al.textContent = af.series || '';
                ag.appendChild(al);
                const am = document.createElement('td');
                am.textContent = af.T || '';
                ag.appendChild(am);
                const an = document.createElement('td');
                an.innerHTML = af.K || '';
                ag.appendChild(an);
                const at = document.createElement('td');
                at.textContent = af.pK || '';
                ag.appendChild(at);
                ad.appendChild(ag);
            }
            e.innerHTML = '';
            e.appendChild(ad);
        }
    };

    const ao = () => {
        fetch('table.json')
            .then(ap => ap.json())
            .then(aq => {
                g = aq;
                h = [...g];
                s('');
                if (c.value.length > 0) {
                    s(c.value);
                }
                c.addEventListener('input', (ar) => {
                    let as = ar.target.value;
                    if (as.length > 200) {
                        as = as.slice(0, 200);
                        c.value = as;
                    }
                    if (as.length > 0 && d) d.style.display = 'flex';
                    else if (d) d.style.display = 'none';
                    s(as);
                });
                if (d) {
                    d.addEventListener('click', () => {
                        c.value = '';
                        d.style.display = 'none';
                        s('');
                    });
                }
            })
            .catch(at => {
                console.error('数据加载失败:', at);
                e.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;">⚠️ 无法加载数据文件，请确保 "table.json" 在同一目录下</td></tr>';
                f.style.display = 'none';
            });
    };

    if (b) {
        b.addEventListener('click', () => {
            a.classList.toggle('dark');
            const au = b.querySelector('i');
            if (a.classList.contains('dark')) {
                au.classList.remove('fa-sun');
                au.classList.add('fa-moon');
            } else {
                au.classList.remove('fa-moon');
                au.classList.add('fa-sun');
            }
        });
    }

    if (c && d) {
        c.addEventListener('input', () => {
            if (c.value.length > 0) d.style.display = 'flex';
            else d.style.display = 'none';
        });
        d.style.display = 'none';
    }

    ao();
});