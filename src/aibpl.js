import { loadItems, getItemById } from './itemLoader.js';

const __DEBUG = true;

async function aipbl() {
    const items = await loadItems();

    if (__DEBUG) console.log("Loaded items:", items); 
    if (__DEBUG) console.log("item 28146:", getItemById(28146));

}

aipbl();