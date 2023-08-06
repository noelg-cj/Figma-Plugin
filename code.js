//import { getNodes } from "./src/htmlProcessor";

figma.showUI(__html__, { themeColors: true, } );

async function getPixels(node, type) {
    const newFills = []
    for (const paint of node.fills) {
      if (paint.type === 'IMAGE') {

        const image = figma.getImageByHash(paint.imageHash)
        const bytes = await image.getBytesAsync()

        figma.showUI(__html__, { visible: false })
        console.log(type);
        figma.ui.postMessage({ data: bytes, mode: type })
  
        const newBytes = await new Promise((resolve, reject) => {
          figma.ui.onmessage = value => resolve(value)
        })
  
        const newPaint = JSON.parse(JSON.stringify(paint))
        newPaint.imageHash = figma.createImage(newBytes).hash
        newFills.push(newPaint)
      }
    }
    node.fills = newFills
  }


figma.ui.onmessage = msg => {
    if (msg.type === 'invert') {
        console.log("Message recieved!");
        console.log(figma.currentPage.selection[0]);
        figma.ui.postMessage("hi");
        getPixels(figma.currentPage.selection[0], msg.type);
    }

    else if (msg.type === 'vignette') {
        console.log("vig msg");
        getPixels(figma.currentPage.selection[0], msg.type);
    }

    //figma.closePlugin();
};


