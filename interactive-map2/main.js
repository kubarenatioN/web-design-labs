const markerHtml = `<g>
<path class="marker-bg" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
<circle class="marker-circle" fill-rule="nonzero" cx="14" cy="14" r="7"></circle>
</g>`
const parks = [
    {
        id: "Kakamega",
        markerPos: {
            x: 45,
            y: 260,
        },
        descr: [
            'Амбосели — один из самых старых национальных парков Кении. Он расположен на юго-западе страны, по соседству с национальными парками Тсаво и горой Килиманджаро. Его площадь составляет 392 кв.км.',
            'По кенийским стандартам очень маленький парк и является одним из красивейших мест в стране благодаря виднеющейся вдали горе Килиманджаро (5895м).'
        ],
        name: 'Амбосели',
        image: 'amboseli.jpg',
    },
    {
        id: "Kajiado",
        markerPos: {
            x: 170,
            y: 400,
        },
        descr: [
            'Сафари на 3 дня в Масаи-Маре — это лучший способ быстро посмотреть всех самых известных животных Африки. Этот тур идеально подходит для тех, у кого мало времени, а хочется все самое интересное и сразу!',
            'Парк Масаи-Мара – один из главных достопримечательностей Кении. Он расположен на юго-западе страны и связан с Танзанийским заповедником Серенгети, который, по сути, является продолжением Масаи-Мара.'
        ],
        name: 'Масаи Мара',
        image: 'masai.jpg',
    },
    {
        id: "Samburu",
        markerPos: {
            x: 180,
            y: 200,
        },
        descr: [
            'Данный тур подойдет для тех, кто планирует посетить прекрасные пляжи Индийского океана, а также желает не упустить возможность прочувствовать настоящее африканское сафари, которое даст Вам ощутить себя настоящим искателем приключений.',
            'Никакая экскурсия из пляжного отеля не позволит в полной мере испытать опыт настоящего сафари с проживанием в колоритных лодж, и ощущением дикой природы всего в нескольких шагах от себя!'
        ],
        name: 'Восточный Тсаво',
        image: 'tsavo.jpg',
    },
    {
        id: "Wajir",
        markerPos: {
            x: 340,
            y: 170,
        },
        descr: [
            'Завтрак в лодже. Утренний сафари по заповеднику Солтлик. Заповедник Солтлик расположен вокруг водопоя и солонца, к которому приходит множество животных, чтобы полизать богатую натрием почву. Стада буйволов, зебр, антилоп, слонов приведут Вас в восторг.',
            'Проведите время на побережье Индийского океана и выберите для себя интересные развлечения и экскурсии с нашими русскоязычными гидами.'
        ],
        name: 'Солтик',
        image: 'soltik.jpg',
    },
]

const body = document.querySelector('body')
const imgPath = 'images/regions/'

const tooltips = []
const regionsMap = []
const markers = []
let activeTooltip
let activeRegion
let guide

const root = document.getElementById('map')
const descrRoot = document.getElementById('region')
const map = document.getElementById('map-svg')
const regionsCol = map.children
let regions = []
let svgRatioX
let svgRatioY
let tooltip = null

calcSvgRatio()
regions = Array.from(regionsCol)
regions.forEach(r => {
    const rTitle = r.getAttribute('title')
    let pNode
    if (parks.some(p => {
        if (p.id === rTitle) {
            pNode = p
            regionsMap.push({id: p.id, r, park: p})
            return true
        }
        return false
    })) {
        r.classList.add('noticable');
        const marker = createMarker(pNode)
        markers.push(marker)
        tooltips.push(createTooltip(pNode))    
        root.append(marker)
    }
})

init()

function createTitle(parkNode) {
    const p = document.createElement('h2')
    const { name } = parkNode
    p.textContent = name
    p.classList.add('region-title')
    return p
}

function createDescr(parkNode) {
    const wrapper = document.createElement('div')
    parkNode.descr.forEach(d => {
        const p = document.createElement('p')
        p.textContent = d
        p.classList.add('region-paragraph')
        wrapper.append(p)
    })
    return wrapper
}

function createMarker(parkNode) {
    const {x, y} = parkNode.markerPos
    const {name} = parkNode
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    marker.innerHTML = markerHtml
    marker.classList.add('map-marker')
    marker.setAttribute('viewBox', `0 0 28 36`)
    const svgX = svgRatioX * x
    const svgY = svgRatioY * y
    marker.style.left = `${svgX}px`
    marker.style.top = `${svgY}px`
    marker.setAttribute('data-region', `${name}`)
    marker.addEventListener('mouseenter', () => {
        marker.classList.add('active')

        activeRegion = regionsMap.find(r => r.id === parkNode.id).r
        activeRegion.classList.add('active')
    })
    marker.addEventListener('mouseleave', () => {
        marker.classList.remove('active')

        activeRegion.classList.remove('active')
    })
    marker.addEventListener('click', (e) => {
        resetActiveSelection()
        marker.classList.add('checked')
        const r = regionsMap.find(r => r.id === parkNode.id)
        r.r.classList.add('checked')

        activeTooltip = tooltips.find(t => t.id === parkNode.id).el
        activeTooltip.classList.add('active')

        moveGuide(svgX - 30, svgY)
    })
    return marker
}

function createGuide(x, y) {
    guide = document.createElement('img')
    guide.src = 'images/guide.png'
    guide.style.left = `${x || 0}px`
    guide.style.top = `${y || 0}px`
    guide.classList.add('guide')
    root.append(guide)
}

function calcSvgRatio() {
    const viewBoxX = 457.63434
    const viewBoxY = 580.54065
    const w = map.clientWidth
    const h = map.clientHeight
    svgRatioX = w / viewBoxX
    svgRatioY = h / viewBoxY
}

function createTooltip(parkNode) {
    const wrapper = document.createElement('div')
    wrapper.classList.add('tooltip-wrapper')
    const title = createTitle(parkNode)
    const img = document.createElement('img')
    img.src = `${imgPath}${parkNode.image}`
    const descr = createDescr(parkNode)
    const button = document.createElement('button')
    button.classList.add('button')
    button.textContent = 'Перейти к туру'
    wrapper.append(img, title, descr, button)
    descrRoot.append(wrapper)
    return { id: parkNode.id, el: wrapper }
}


function resetActiveSelection() {
    markers.forEach(m => m.classList.remove('checked'))
    regionsMap.forEach(r => r.r.classList.remove('checked'))
    tooltips.forEach(t => t.el.classList.remove('active'))
}

function init() {
    markers[0].classList.add('checked')
    regionsMap[0].r.classList.add('checked')
    tooltips[0].el.classList.add('active')
   
    const {x, y} = regionsMap[0].park.markerPos
    createGuide(x * svgRatioX - 30, y * svgRatioY)
}

function moveGuide(x, y) {
    guide.style.left = `${x}px`
    guide.style.top = `${y}px`
}