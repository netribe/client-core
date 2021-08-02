
export default function parse(data){
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
};
