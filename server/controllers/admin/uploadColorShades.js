// /* eslint-disable no-promise-executor-return */
// /* eslint-disable no-inner-declarations */
// /* eslint-disable consistent-return */
// /* eslint-disable no-async-promise-executor */
// /* eslint-disable import/named */
// import xlsx from 'xlsx';
// import { ApiResponseUtility, ApiErrorUtility } from '../../utility';

// import { ColorModel } from '../../models';

// export default () => new Promise(async (resolve, reject) => {
//     try {
//         const filePath = '/Users/appknit/Documents/GitHub/paintplus-backend/server/color.xlsx';

//         const workbook = xlsx.readFile(filePath);
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];

//         const data = xlsx.utils.sheet_to_json(sheet, { header: ['ncsCode', 'hexCode'] });

//         const processedData = data.map((row) => ({
//             ncsCode: row.ncsCode,
//             hexCode: row.hexCode,
//         }));

//         processedData.forEach(async (element) => {
//             await ColorModel.findOneAndUpdate({
//                 ncsCode: element.ncsCode,
//                 hexCode: element.hexCode,
//             }, {
//                 $set: {
//                     name: '',
//                     groupName: '',
//                     price: 0,
//                     ncsCode: element.ncsCode,
//                     hexCode: element.hexCode,
//                 },
//             }, {
//                 upsert: true,
//             });
//         });

//         return resolve(new ApiResponseUtility({
//             message: 'Done',
//         }));
//     } catch (error) {
//         console.log(error);
//         reject(new ApiErrorUtility({ message: 'Error while uploading file', error }));
//     }
// });
