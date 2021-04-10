const args = process.argv;
const imagemagick = require('imagemagick');

if (args.length === 7){
    resizeImage()
}else{
    getCoordinates()
}


function getCoordinates(){
    imagemagick.readMetadata('./assets/imgg.jpeg', function(err, metadata) {
        if (err) throw err;
        if (metadata.exif !== undefined && args.length !== 7){
            let long = metadata.exif.gpsLatitude;
            let lat = metadata.exif.gpsLongitude;
            console.log('lon: ' + transformer(long));
            console.log('lat: ' + transformer(lat));
        }else {
            console.log('Данных нет')
        }
    })
}


function transformer(coordinate){
    coordinate = coordinate.split(' ')
    let sum = 0;
    for(let i = 0; i<coordinate.length; i++){
        let x = coordinate[i].split('/');
        let x1 = Number(x[0]);
        let x2 = Number(x[1].replace(',',''));
        if (i === 1) sum += x1 / (60 * x2);
        else if (i === 2) sum += x1 / (3600 * x2);
        else sum += x1/x2;
    }
    return Math.round(sum * 100) / 100;
}

function argsCheck(args){
    let obj ={}
    obj.path = args[6];
    args[2]==='-w' ? obj.width = Number(args[3]): '';
    args[4]==='-w' ? obj.width = Number(args[5]): '';
    args[2]==='-h' ? obj.height = Number(args[3]): '';
    args[4]==='-h' ? obj.height = Number(args[5]): '';
    return obj
}

function resizeImage(){
    let data = argsCheck(args)
    imagemagick.resize({
        srcPath: data.path,
        dstPath: data.path,
        width: data.width,
        height: data.height,
    }, function(err){
        if (err) throw err;
        imagemagick.identify('./assets/pp.jpg', function(err, output){
            if (err) throw err;
            console.log(output.filesize);
        });
    });
}
//TODO: findContry():
// function findCountry(long,lat){

// }
