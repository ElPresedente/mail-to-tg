import { ParsedMail } from "mailparser";
import fs from 'fs'

const files_dir = 'files'

export default function (mail: ParsedMail) {
    mail.attachments.forEach(item => {
        console.log(JSON.stringify(item.content))
        const file_name = `${item.checksum}_${item.filename}`;
        const file_path = `./${files_dir}/${file_name}`;
        fs.writeFile(file_path, item.content, 'binary', () => {})
    })
    
    //fs.writeFile('mail.json', JSON.stringify(mail.attachments),'utf8')
    // mail.attachments.forEach(async item => {
    //     if(item.type == 'attachment'){
    //         //сохраняем файлик
    //         if(item.filename == 'test.txt'){
    //             const file_content = Buffer.from(item.content.buffer).toString('utf8')
    //             console.log('----------------------------------------')
    //             console.log(file_content)
    //             console.log('----------------------------------------')
    //         }
    //         const file_name = `${item.checksum}_${item.filename}`;
    //         const file_path = `./${files_dir}/${file_name}`;
    //         const file = await fs.promises.open(file_path, 'a')
    //         fs.promises.writeFile(file, Buffer.from(item.content.buffer)     )
    //     }
    // })
}