export const MODELS=[
 {id:'36',name:'MONO 36',area:36,bedrooms:1,dimensions:'8 × 4,5 м',price:3200000,terracePrice:280000,comfortPrice:420000,tag:'Место для себя',description:'Небольшой дом с большим окном в лес. Для выходных вдвоём, самостоятельной жизни или гостевого пространства.',image:'mono-36',rooms:[{id:'living',name:'Кухня-гостиная',area:18,note:'Открытое пространство для неспешных завтраков и вечеров у окна.',x:0,y:0,w:60,h:100},{id:'bed',name:'Спальня',area:10,note:'Отдельная спальня с местом для двуспальной кровати и шкафа.',x:60,y:0,w:40,h:55},{id:'bath',name:'Санузел',area:4,note:'Душевая, умывальник и место для стиральной машины.',x:60,y:55,w:40,h:25},{id:'hall',name:'Прихожая',area:4,note:'Место для верхней одежды и вещей для прогулок.',x:60,y:80,w:40,h:20}]},
 {id:'72',name:'MONO 72',area:72,bedrooms:2,dimensions:'12 × 6 м',price:5400000,terracePrice:390000,comfortPrice:720000,tag:'Жизнь в своём ритме',description:'Две спальни, светлая гостиная и место для жизни круглый год. Дом, который легко становится главным.',image:'mono-72',rooms:[{id:'living',name:'Кухня-гостиная',area:30,note:'Общий стол, уютный диван и панорамное окно с выходом на террасу.',x:0,y:0,w:52,h:100},{id:'bed',name:'Спальня',area:14,note:'Тихая сторона дома, двуспальная кровать и встроенное хранение.',x:52,y:0,w:24,h:62},{id:'second',name:'Вторая спальня',area:12,note:'Детская, гостевая или кабинет — назначение выбираете вы.',x:76,y:0,w:24,h:62},{id:'bath',name:'Санузел',area:6,note:'Полноценная душевая и место для бытовой техники.',x:52,y:62,w:24,h:38},{id:'hall',name:'Прихожая и хранение',area:10,note:'Входная зона, гардероб и пространство для бытовых вещей.',x:76,y:62,w:24,h:38}]},
 {id:'108',name:'MONO 108',area:108,bedrooms:3,dimensions:'18 × 6 м',price:7600000,terracePrice:540000,comfortPrice:1080000,tag:'Больше места близким',description:'Три спальни и просторная общая зона. Для семейных встреч, тихих утренних часов и всего, что вы любите.',image:'mono-108',rooms:[{id:'living',name:'Кухня-гостиная',area:42,note:'Большое общее пространство с кухней, столовой и выходом на террасу.',x:0,y:0,w:45,h:100},{id:'bed',name:'Главная спальня',area:18,note:'Личное пространство с вместительным гардеробом.',x:45,y:0,w:30,h:58},{id:'second',name:'Вторая спальня',area:14,note:'Светлая комната для ребёнка или гостей.',x:75,y:0,w:25,h:58},{id:'third',name:'Третья спальня',area:12,note:'Дополнительная спальня или отдельный рабочий кабинет.',x:45,y:58,w:25,h:42},{id:'bath',name:'Санузел',area:8,note:'Пространство для ванны или просторной душевой.',x:70,y:58,w:15,h:42},{id:'hall',name:'Прихожая и хранение',area:14,note:'Удобная входная зона, технический шкаф и хранение.',x:85,y:58,w:15,h:42}]}
];
export const FACADES=[{id:'larch',name:'Натуральная лиственница',short:'Лиственница',price:0,color:'#b49d77',description:'Живой рисунок дерева, который красиво меняется со временем.'},{id:'graphite',name:'Графит',short:'Графит',price:180000,color:'#3e4744',description:'Глубокий тёмный оттенок и выразительная геометрия объёмов.'}];
export const FINISHES=[{id:'base',name:'Базовая',description:'Чистовая отделка, окна, двери, электрика и инженерная разводка. Мебель и кухонное оборудование не включены.'},{id:'comfort',name:'Комфорт',description:'Всё из базовой комплектации, плюс кухня с техникой, встроенное хранение и сантехника.'}];
export const DEFAULT_CONFIG={model:'72',facade:'larch',terrace:'none',finish:'base'};
export const modelById=id=>MODELS.find(m=>m.id===id);
export const money=value=>new Intl.NumberFormat('ru-RU').format(value).replace(/\u00a0/g,' ')+' ₽';
export function validateConfig(c){return !!c && !!modelById(c.model) && FACADES.some(f=>f.id===c.facade) && ['none','open'].includes(c.terrace) && FINISHES.some(f=>f.id===c.finish);}
export function calculate(c){
 if(!validateConfig(c))throw new Error('Недопустимая конфигурация дома');
 const m=modelById(c.model);
 return m.price+FACADES.find(f=>f.id===c.facade).price+(c.terrace==='open'?m.terracePrice:0)+(c.finish==='comfort'?m.comfortPrice:0);
}
export function specification(c){
 const total=calculate(c),m=modelById(c.model);
 return `MONO — ваша конфигурация\n${m.name} / ${m.area} м² / ${m.bedrooms} ${m.bedrooms===1?'спальня':'спальни'}\nФасад: ${FACADES.find(f=>f.id===c.facade).name}\nТерраса: ${c.terrace==='open'?'Открытая терраса':'Без террасы'}\nКомплектация: ${FINISHES.find(f=>f.id===c.finish).name}\nПредварительная стоимость: ${money(total)}\n\nФундамент, доставка, монтаж и подключение к внешним сетям не включены.\nЭто демонстрационный расчёт концептуального проекта. Не является коммерческим предложением.\nИзображения иллюстрируют архитектурную идею; планировка и комплектация имеют приоритет.\n`;
}
export function resolveRoute(path,search=''){
 const clean=path.replace(/\/$/,'')||'/';
 if(clean==='/')return {page:'index'};
 if(clean==='/approach')return {page:'approach'};
 if(clean==='/configure'){const id=new URLSearchParams(search).get('model');return {page:'configure',model:modelById(id)?id:'72'};}
 const match=clean.match(/^\/homes\/(36|72|108)$/);
 return match?{page:'home',model:match[1]}:{page:'notFound'};
}
export function configurationForRoute(current,route){
 const selected=validateConfig(current)?current:DEFAULT_CONFIG;
 if(route.page==='home'&&modelById(route.model))return {...DEFAULT_CONFIG,model:route.model};
 if(route.page==='configure'&&modelById(route.model))return {...selected,model:route.model};
 return {...selected};
}
export function hashId(hash){
 if(!hash||hash==='#')return null;
 try{return decodeURIComponent(hash.replace(/^#/,''));}catch{return null;}
}
export function exteriorAsset(c,time='day'){
 if(!validateConfig(c)||!['day','night'].includes(time))throw new Error('Недопустимая конфигурация изображения');
 return `mono-${c.model}${c.facade==='graphite'?'-graphite':''}${time==='night'?'-night':''}${c.terrace==='none'?'-no-terrace':''}`;
}
