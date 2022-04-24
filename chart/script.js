const ctx = document.getElementById("chart").getContext("2d");

const colors = {
	by: {
		backgroundColor: "rgba(0, 205, 0, 0.1)",
		borderColor: "rgba(0, 205, 0, 0.8)",
	},
	ru: {
		backgroundColor: "rgba(0, 0, 200, 0.1)",
		borderColor: "rgba(0, 0, 200, 0.8)",
	},
	ua: {
		backgroundColor: "rgba(200, 205, 0, 0.1)",
		borderColor: "rgba(200, 205, 0, 0.8)",
	},
	kz: {
		backgroundColor: "rgba(205, 0, 100, 0.1)",
		borderColor: "rgba(205, 0, 100, 0.8)",
	},
};

const chartData = [
	{
		label: "Беларусь",
		data: [
			{
				x: new Date(2013, 0),
				y: "Беларусь",
				v: 172,
			},
			{
				x: new Date(2014, 0),
				y: "Беларусь",
				v: 161,
			},
			{
				x: new Date(2015, 0),
				y: "Беларусь",
				v: 146,
			},
			{
				x: new Date(2016, 0),
				y: "Беларусь",
				v: 136,
			},
			{
				x: new Date(2017, 0),
				y: "Беларусь",
				v: 128,
			},
			{
				x: new Date(2018, 0),
				y: "Беларусь",
				v: 124,
			},
			{
				x: new Date(2019, 0),
				y: "Беларусь",
				v: 120,
			},
		],
		...colors.by,
	},
	{
		label: "Россия",
		data: [
			{
				x: new Date(2013, 0),
				y: "Россия",
				v: 146,
			},
			{
				x: new Date(2014, 0),
				y: "Россия",
				v: 146,
			},
			{
				x: new Date(2015, 0),
				y: "Россия",
				v: 138,
			},
			{
				x: new Date(2016, 0),
				y: "Россия",
				v: 144,
			},
			{
				x: new Date(2017, 0),
				y: "Россия",
				v: 149,
			},
			{
				x: new Date(2018, 0),
				y: "Россия",
				v: 156,
			},
			{
				x: new Date(2019, 0),
				y: "Россия",
				v: 163,
			},
		],
		...colors.ru,
	},
	{
		label: "Украина",
		data: [
			{
				x: new Date(2013, 0),
				y: "Украина",
				v: 78,
			},
			{
				x: new Date(2014, 0),
				y: "Украина",
				v: 76,
			},
			{
				x: new Date(2015, 0),
				y: "Украина",
				v: 72,
			},
			{
				x: new Date(2016, 0),
				y: "Украина",
				v: 58,
			},
			{
				x: new Date(2017, 0),
				y: "Украина",
				v: 54,
			},
			{
				x: new Date(2018, 0),
				y: "Украина",
				v: 51,
			},
			{
				x: new Date(2019, 0),
				y: "Украина",
				v: 49,
			},
		],
		...colors.ua,
	},
	{
		label: "Казахстан",
		data: [
			{
				x: new Date(2013, 0),
				y: "Казахстан",
				v: 299,
			},
			{
				x: new Date(2014, 0),
				y: "Казахстан",
				v: 309,
			},
			{
				x: new Date(2015, 0),
				y: "Казахстан",
				v: 327,
			},
			{
				x: new Date(2016, 0),
				y: "Казахстан",
				v: 306,
			},
			{
				x: new Date(2017, 0),
				y: "Казахстан",
				v: 282,
			},
			{
				x: new Date(2018, 0),
				y: "Казахстан",
				v: 273,
			},
			{
				x: new Date(2019, 0),
				y: "Казахстан",
				v: 269,
			},
		],
		...colors.kz,
	},
];

const chart = new Chart(ctx, {
	type: "bubble",
	data: {
		datasets: chartData,
	},
	options: {
		interaction: {
			mode: "point",
		},
		scales: {
			x: {
				type: "time",
				position: "left",
				time: {
					unit: "year",
					displayFormats: {
						year: "yyyy год",
					},
				},
				offset: true,
			},
			y: {
				type: "category",
				position: "bottom",
				labels: ["Беларусь", "Россия", "Украина", "Казахстан"],
				offset: true,
			},
		},
		elements: {
			point: {
				radius: function (context) {
					const size = context.chart.width / 1000;
					const base = context.raw.v;
					const r = base * size / 8
					if (context.raw.v === 299) {
						console.log(size, r);
					}
					return r
				},
				hoverBorderWidth: 3,
			},
		},
		plugins: {
			tooltip: {
				callbacks: {
					label: function (context) {
						const value = context.raw.v
						return `${value} чел.`
					},
				},
			},
		},
	},
});
