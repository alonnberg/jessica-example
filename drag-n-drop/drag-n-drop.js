const getDragID = event => {
    return event.dataTransfer.getData('text/plain');
}

const qsa = (sel, root) => {
    return Array.from((root || document).querySelectorAll(sel))
}

const qs = (sel, root) => {
    return (root || document).querySelector(sel);
}

const getDataSum = () => {
    return Array.prototype.reduce.call(document.querySelectorAll('.day .card'), function(dataSum, card) {
        dataSum.type[card.dataset.type] = (dataSum.type[card.dataset.type]||0) +1;
        dataSum.name[card.dataset.name] = (dataSum.name[card.dataset.name]||0) +1;
        card.id = dataSum.id++;
        return dataSum;
    }, { id: 1, type: {}, name: {} });
}

const getFreeID = () => {
    document.querySelectorAll('toolbox *[id]').forEach(toolboxTool => {
       toolboxTool.removeAttribute('id');
    });

    return getDataSum().id;
}

const updateCounts = () => {
    const dataSum = getDataSum();
    console.log(dataSum);
    qsa('toolbox article').forEach(function(tool, i) {
        qs('.counter', tool).innerHTML = dataSum.name[tool.dataset.name] || '';
    });

    qsa('toolsum tr').forEach(function(toolsum, i) {
        qs('td:nth-child(2)',toolsum).innerHTML = dataSum.type[toolsum.dataset.type] || '';
    });

};

const dragStart = target => {
    console.log('dragstarted', target);
    target.classList.add('dragging');
};

const dragEnd = target => {
//    console.log('dragended', target);
    target.classList.remove('dragging');
};

const dragEnter = event => {
    event.currentTarget.classList.add('drop');
};

const dragLeave = event => {
    event.currentTarget.classList.remove('drop');
};

const drag = event => {
    event.dataTransfer.setData('text/html', event.currentTarget.outerHTML);
    event.currentTarget.id = event.currentTarget.id || getFreeID();
    event.dataTransfer.setData('text/plain', event.currentTarget.id);
};

const dropTool = event => {
//    console.log('dropTool', event.target);
    document.querySelectorAll('.day').forEach(column => column.classList.remove('drop'));
    var moved = document.querySelector(`.day article[id="${event.dataTransfer.getData('text/plain')}"]`);
    if(moved) moved.remove();

    event.preventDefault();

    var newTool = event.dataTransfer.getData('text/html');
    var addID = getFreeID();
    newTool = newTool.replace(/<meta.+?<article/, '<article id="'+addID +'"');
    event.currentTarget.querySelector('.tools').innerHTML += newTool;

    var added = event.currentTarget.querySelector('.tools article[id="'+addID+'"]');
    var counter = added.querySelector('.counter');
    if(counter)
        added.removeChild(counter);

    updateCounts();
};

const removeTool = event => {
//    console.log('removeTool', event.target);
    document.querySelectorAll('toolbox').forEach(column => column.classList.remove('drop'));
    var moved = document.querySelector(`.day article[id="${event.dataTransfer.getData('text/plain')}"]`)
    if(moved) {
        moved.remove();
        getFreeID();
    }
 
    event.preventDefault();

    updateCounts();
};

const allowDrop = event => {
//    console.log('allowDrop', event.target);
    event.preventDefault();
};

document.addEventListener('dragstart', e => {
    if (e.target.className.includes('card')) {
        dragStart(e.target);
    }
});

document.addEventListener('dragend', e => {
    if (e.target.className.includes('card')) {
        dragEnd(e.target);
    }
});


var toolSet = [
 { name: 'doftpromenad', 'type': 'doft', imgs: [ {'style':'width:76.1769px;height:81.0392px;transform:translate(-7.10543e-15px,0px) rotate(0deg)', 'src':'splatter.svg'} ] },
{ name: 'blodspår', 'type': 'jakt', imgs: [ {'style':'width: 81.2778px; height: 58.3723px; transform: translate(267.551px, 309.797px);', 'src':'blood.png'} ] },
{ name: 'flirtpole', 'type': 'jakt', imgs: [ {'style':'width: 44.7751px; height: 72.6574px; transform: translate(286.227px, 501.014px) rotate(17.1364deg);', 'src':'cat-toy-with-bow.png'} ] },
{ name: 'gräva', 'type': 'jakt', imgs: [ {'style':'width: 92.9087px; height: 56.6743px; transform: translate(261.736px, 717.475px);', 'src':'pile-of-soil.png'} ] },
{ name: 'slakta gosedjur', 'type': 'jakt', imgs: [ {'style':'width: 65.184px; height: 75.0319px; transform: translate(459.805px, 708.296px);', 'src':'teddy-bear.png'} ] },
{ name: 'sorkjakt', 'type': 'jakt', imgs: [ {'style':'width: 65.0433px; height: 57.8072px; transform: translate(275.669px, 110.323px);', 'src':'mouse.png'} ] },
{ name: 'klickerträning', 'type': 'kognitivt', imgs: [ {'style':'width: 127.268px; height: 84.7923px; transform: translate(427.055px, 91.2919px);', 'src':'dogclicker.png'} ] },
{ name: 'mat i matleksak', 'type': 'mat', imgs: [ {'style':'width: 77.328px; height: 77.328px; transform: translate(90.2507px, 703.808px) rotate(39.363deg);', 'src':'kong.png'} ] },
{ name: 'popcorn', 'type': 'mat', imgs: [ {'style':'width: 81.726px; height: 85.4651px; transform: translate(272.919px, 911.342px);', 'src':'popcorn-snack-illustration.png'} ] },
{ name: 'slita i kartonger', 'type': 'mat', imgs: [ {'style':'width: 76.8966px; height: 63.6145px; transform: translate(92.2438px, 309.797px);', 'src':'cardboard-box.png'} ] },
{ name: 'smakbricka', 'type': 'mat', imgs: [ 
    {'style':'width: 84.9241px; height: 27.388px; transform: translate(449.935px, 959.129px);', 'src':'tray.png'},
    {'style':'width: 23.794px; height: 60.2379px; transform: translate(464.181px, 916.348px) rotate(-12.2384deg);', 'src':'nostalgic-anime-pineapple.png'},
    {'style':'width: 22.3844px; height: 47.8837px; transform: translate(451.292px, 947.185px) rotate(-58.1049deg);', 'src':'carrot-vegetable-illustration.svg'},
    {'style':'width: 27.1159px; height: 25.4889px; transform: translate(497.77px, 950.954px) rotate(9.07897deg);', 'src':'cheese-wedge.svg'},
    {'style':'width: 30.504px; height: 34.1506px; transform: translate(481.751px, 945.011px) rotate(24.2839deg);', 'src':'illustration-of-a-sausage.svg'},
] },
{ name: 'spännande inslag i matskålen', 'type': 'mat', imgs: [ {'style':'width: 79.5354px; height: 46.9259px; transform: translate(90.9244px, 115.764px);', 'src':'food-bowl.png'} ] },
{ name: 'torrfoder i gräs', 'type': 'mat', imgs: [ {'style':'width: 72.4496px; height: 71.8157px; transform: translate(94.4673px, 924.923px);', 'src':'brown-lentils.png'} ] },
{ name: 'tugga ben', 'type': 'mat', imgs: [ {'style':'width: 71.4084px; height: 34.1462px; transform: translate(93.2105px, 520.27px);', 'src':'illustration-of-a-bone.svg'} ] },
{ name: 'skogspromenad', 'type': 'miljo', imgs: [ {'style':'width: 75.9137px; height: 68.3224px; transform: translate(1566.72px, 98.45px);', 'src':'illustration-of-trees.svg'} ] },
{ name: 'sola', 'type': 'miljo', imgs: [ 
    {'style':'width: 68.1528px; height: 40.8065px; transform: translate(1572.4px, 540px);', 'src':'sleeping-jack-russell-terrier-dog.png'},
    {'style':'width: 39.4903px; height: 39.4903px; transform: translate(1585.73px, 496.031px);', 'src':'sun-icon.svg'} 
] },
{ name: 'triggerfri promenad', 'type': 'miljo', imgs: [ {'style':'width: 90.3444px; height: 22.7431px; transform: translate(1560.3px, 329.453px) rotate(-30.2631deg);', 'src':'dog-paw-prints.svg'} ] },
{ name: 'larma', 'type': 'revir', imgs: [ {'style':'width: 61.3141px; height: 64.6029px; transform: translate(641.634px, 303.567px);', 'src':'isolated-house-icon-flat-design.svg'} ] },
{ name: 'patrullera tomten', 'type': 'revir', imgs: [ {'style':'width: 81.0965px; height: 43.0549px; transform: translate(631.319px, 515.816px);', 'src':'fence-gradient-icon.svg'} ] },
{ name: 'yla', 'type': 'revir', imgs: [ {'style':'width: 57.9884px; height: 68.8847px; transform: translate(643.296px, 99.2457px);', 'src':'howling-wolf-illustration.svg'} ] },
{ name: 'drag', 'type': 'rorelse', imgs: [ {'style':'width: 241.801px; height: 66.7977px; transform: translate(999.663px, 928.687px) rotate(0deg); recenter:-80px', 'src':'husky-pulling-sled.png'} ] },
{ name: 'klättra och balansera', 'type': 'rorelse', imgs: [ {'style':'width: 87.6897px; height: 49.4251px; transform: translate(998.734px, 110.859px);', 'src':'illustration-of-rocks.svg'} ] },
{ name: 'promenad i terräng', 'type': 'rorelse', imgs: [ {'style':'width: 73.833px; height: 78.4935px; transform: translate(1004.77px, 299.737px);', 'src':'blueberry.png'} ] },
{ name: 'simma', 'type': 'rorelse', imgs: [ {'style':'width: 82.6724px; height: 54.3571px; transform: translate(1000.49px, 510.164px);', 'src':'water-splatter.png'} ] },
{ name: 'springa', 'type': 'rorelse', imgs: [ {'style':'width: 85.7043px; height: 49.9227px; transform: translate(999.253px, 720.85px);', 'src':'running-mongrel-dog.png'} ] },
{ name: 'leka med din hund', 'type': 'samarbete', imgs: [ {'style':'width: 79.3297px; height: 59.4252px; transform: translate(1379.08px, 108.705px);', 'src':'hand-drawn-chicken-toy.svg'} ] },
{ name: 'hantering', 'type': 'socialt', imgs: [ 
    {'style':'width: 117.793px; height: 47.1277px; transform: translate(817.556px, 738.252px) rotate(120.656deg);', 'src':'brush.png'},
    {'style':'width: 68.3529px; height: 68.3529px; transform: translate(808.921px, 708.296px);', 'src':'pliers.png'} 
] },
{ name: 'kompispromenad', 'type': 'socialt', imgs: [ {'style':'width: 73.7948px; height: 93.1164px; transform: translate(819.421px, 292.425px);', 'src':'lovers-couple-walking-with-dogs.png'} ] },
{ name: 'massage', 'type': 'socialt', imgs: [ {'style':'width:94.7941px;height:58.7723px;transform:translate(0px,0px) rotate(0deg)', 'src':'hands-massage.svg'} ] },
{ name: 'rulla sig', 'type': 'socialt', imgs: [ {'style':'width: 85.4559px; height: 43.3689px; transform: translate(813.069px, 518.316px);', 'src':'cat-rolling-icon.png'} ] },
{ name: 'bädda', 'type': 'vila', imgs: [ {'style':'width: 87.3755px; height: 62.3643px; transform: translate(1189.98px, 307.801px);', 'src':'blankets.png'} ] },
{ name: 'koja', 'type': 'vila', imgs: [ {'style':'width: 83.8746px; height: 65.1172px; transform: translate(1191.45px, 103.013px);', 'src':'tent.svg'} ] }
];