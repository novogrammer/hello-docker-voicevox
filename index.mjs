import fs from "fs";

const OUTPUT_TO_FILE=false;
// const REPEAT_COUNT=Infinity;
const REPEAT_COUNT=3;
const DELAY_S=2;

const text = `あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。

またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。`
async function doActionAsync(id){
  const label=`doAction id: ${id}`;
  console.time(label);

  const res = await fetch(`http://localhost:50021/audio_query?text=${text}&speaker=0`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    }

  });
  const query = await res.json();
  const sound = await fetch(`http://localhost:50021/synthesis?speaker=0&enable_interrogative_upspeak=true`, {
    method: "POST",
    headers: { 
      'Content-Type': 'application/json',
      'accept': 'audio/wav',
      'responseType': "stream"
    },
    body: JSON.stringify(query)
  });
  if(OUTPUT_TO_FILE){
    const arrayBuffer = await sound.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync("./index.wav",buffer);
  }

  console.timeEnd(label);
}

function mySleep(delaySecond){
  return new Promise((resolve)=>{
    setTimeout(resolve,delaySecond*1000);
  })
}

async function mainAsync(){
  for(let i=0;i<REPEAT_COUNT;i++){
    try{
      await doActionAsync(i);
    }catch(error){
      console.error(error);
    }
    await mySleep(DELAY_S);
  }
}


mainAsync().catch((error)=>{
  console.error(error);
})
