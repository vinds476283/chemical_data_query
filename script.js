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
    let a = document.body
    let b = document.getElementById('b')
    let c = document.getElementById('c')
    let d = document.getElementById('d')
    let e = document.getElementById('f')
    let f = document.getElementById('g')
    let g = document.getElementById('tableHeader')
    let h = document.getElementById('homeView')
    let i = document.getElementById('dataView')
    let j = document.getElementById('downloadLinks')
    let k = document.getElementById('downloadJson')
    let l = document.getElementById('downloadXlsx')
    let dataSourcePara = document.getElementById('dataSource')
    let m = []
    let n = []
    let o = []

    let p = new URLSearchParams(window.location.search)
    let q = p.get('table')
    let r = p.get('input') || ''

    let s = (t) => {
        if (!t) return ''
        let u = String(t)
        u = u.replace(/<[^>]*>/g, '')
        u = u.replace(/[~_]/g, '')
        u = u.replace(/[\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089]/g, (v) => {
            let w = { '\u2080': '0', '\u2081': '1', '\u2082': '2', '\u2083': '3', '\u2084': '4', '\u2085': '5', '\u2086': '6', '\u2087': '7', '\u2088': '8', '\u2089': '9' }
            return w[v] || v
        })
        return u.toLowerCase()
    }

    let x = (y, z) => {
        let aa = s(y)
        let ab = s(z)
        return aa.includes(ab)
    }

    let ac = () => {
        if (n.length === 0) {
            f.style.display = 'block'
            e.innerHTML = ''
        } else {
            f.style.display = 'none'
            let ad = document.createDocumentFragment()
            for (let ae = 0; ae < n.length; ae++) {
                let af = n[ae]
                let ag = document.createElement('tr')
                for (let ah = 0; ah < o.length; ah++) {
                    let ai = o[ah]
                    let aj = document.createElement('td')
                    let ak = af[ai.key]
                    if (ak === undefined || ak === null) ak = ''
                    aj.innerHTML = ak
                    ag.appendChild(aj)
                }
                ad.appendChild(ag)
            }
            e.innerHTML = ''
            e.appendChild(ad)
        }
    }

    let al = (am) => {
        let an = s(am)
        if (!an) {
            n = [...m]
        } else {
            n = m.filter(ao => {
                for (let ap = 0; ap < o.length; ap++) {
                    let aq = o[ap]
                    let ar = ao[aq.key]
                    if (ar !== undefined && ar !== null && s(ar).includes(an)) return true
                }
                return false
            })
        }
        ac()
    }

    let as = () => {
        if (!q) {
            h.style.display = 'flex'
            i.style.display = 'none'
            j.style.display = 'none'
            if (dataSourcePara) {
                dataSourcePara.style.display = 'none'
                dataSourcePara.innerHTML = ''
            }
            return
        }
        fetch(`${q}.json`)
            .then(at => {
                if (!at.ok) throw new Error()
                return at.json()
            })
            .then(au => {
                if (!Array.isArray(au) || au.length === 0) throw new Error()
                let av = au[0]
                let allKeys = Object.keys(av)
                let displayKeys = allKeys.filter(key => key !== 'thebibliography')
                o = displayKeys.map(key => ({ key: key, label: av[key] || key }))
                m = au.slice(1)
                n = [...m]
                g.innerHTML = ''
                let ax = document.createElement('tr')
                for (let ay = 0; ay < o.length; ay++) {
                    let az = document.createElement('th')
                    az.textContent = o[ay].label
                    ax.appendChild(az)
                }
                g.appendChild(ax)
                ac()
                h.style.display = 'none'
                i.style.display = 'block'
                j.style.display = 'block'
                k.href = `${q}.json`
                k.download = `${q}.json`
                l.href = `${q}.xlsx`
                l.download = `${q}.xlsx`

                let bibliography = av['thebibliography']
                if (dataSourcePara) {
                    if (bibliography && bibliography.trim() !== '') {
                        dataSourcePara.innerHTML = '数据来源：' + bibliography + ' | 若有出入，请以原文为准'
                        dataSourcePara.style.display = 'block'
                    } else {
                        dataSourcePara.style.display = 'none'
                        dataSourcePara.innerHTML = ''
                    }
                }

                if (r) {
                    c.value = r
                    if (d) d.style.display = 'flex'
                    al(r)
                }
            })
            .catch(() => {
                h.style.display = 'flex'
                i.style.display = 'none'
                j.style.display = 'none'
                if (dataSourcePara) {
                    dataSourcePara.style.display = 'none'
                    dataSourcePara.innerHTML = ''
                }
            })
    }

    as()

    if (b) {
        b.addEventListener('click', () => {
            a.classList.toggle('dark')
            let ba = b.querySelector('i')
            if (a.classList.contains('dark')) {
                ba.classList.remove('fa-sun')
                ba.classList.add('fa-moon')
            } else {
                ba.classList.remove('fa-moon')
                ba.classList.add('fa-sun')
            }
        })
    }

    if (c && d) {
        c.addEventListener('input', (bb) => {
            let bc = bb.target.value
            if (bc.length > 200) {
                bc = bc.slice(0, 200)
                c.value = bc
            }
            if (bc.length > 0 && d) d.style.display = 'flex'
            else if (d) d.style.display = 'none'
            al(bc)
        })
        d.addEventListener('click', () => {
            c.value = ''
            d.style.display = 'none'
            al('')
        })
        d.style.display = 'none'
    }
})