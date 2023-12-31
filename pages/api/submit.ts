import { NextApiRequest, NextApiResponse } from "next";
import { DailyWorkersManagementForm } from "@/public/types/DailyWorkersManagementForm.interface";
import moment from "moment";
import path from "path";
const PdfPrinter = require("pdfmake/src/printer");

const normal = path.join(process.cwd(), "fonts", "Roboto-Regular.ttf");
const bold = path.join(process.cwd(), "fonts", "Roboto-Medium.ttf");
var fonts = {
  Roboto: {
    normal: normal,
    bold: bold,
  },
};
const printer = new PdfPrinter(fonts);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  if (req.method === "POST") {
    const cost = (service: string, quantity: number): number => {
      let cost = 0;
      service === "Diária" ? (cost = 80 * quantity) : (cost = 15 * quantity);
      return cost;
    };

    let total = 0;

    const table: DailyWorkersManagementForm[] = req.body.table.map(
      (current: DailyWorkersManagementForm) => {
        const costValue = cost(current.service, current.quantity);
        total += costValue;
        return {
          week: current.week,
          dailyWorker: current.dailyWorker,
          bankInfo: current.bankInfo,
          service: current.service,
          quantity: current.quantity,
          total: costValue,
          paymentDay: current.paymentDay,
        };
      }
    );

    const week = { start: "", end: "" };
    const yearString = table[0].week.substr(0, 4); // Extract the year from the string
    const weekString = table[0].week.substr(6); // Extract the week from the string

    // Get the first day of the week
    week.start = moment(`${yearString}-W${weekString}`, "YYYY-WW")
      .startOf("isoWeek")
      .format("DD/MM/YYYY");

    // Get the last day of the week
    week.end = moment(`${yearString}-W${weekString}`, "YYYY-WW")
      .endOf("isoWeek")
      .format("DD/MM/YYYY");

    const paymentDay = moment(table[0].paymentDay).format("DD/MM/YYYY");

    const logoPath = path.join(process.cwd(), "images", "logo.png");

    const docDefinition = {
      content: [
        {
          columns: [
            {
              image: logoPath,
              width: 80,
              alignment: "left",
              margin: [0, 10],
            },
            {
              stack: [
                {
                  text: "CONTROLE DE DIARISTAS",
                  fontSize: 24,
                  alignment: "center",
                  margin: [0, 10],
                },
              ],
              alignment: "left",
              width: "*",
            },
          ],
        },
        {
          table: {
            widths: ["50%", "50%"],
            body: [
              ["INÍCIO DE SEMANA", "FINAL DE SEMANA"],
              [week.start, week.end],
            ],
          },
          layout: "headerLineOnly",
          style: "miniTable",
        },
        {
          table: {
            headerRows: 1,
            widths: [170, 170, 80, "auto", "auto"],
            body: [
              [
                { text: "DIARISTA", style: "tableHeader" },
                { text: "DADOS BANCÁRIOS", style: "tableHeader" },
                { text: "SERVIÇO", style: "tableHeader" },
                { text: "QTD", style: "tableHeader" },
                { text: "VALOR", style: "tableHeader" },
              ],
              ...table.map((row) => [
                row.dailyWorker,
                row.bankInfo,
                row.service,
                row.quantity,
                row.total,
              ]),
              [
                {
                  text: "TOTAL SEM DESCONTO",
                  colSpan: 4,
                  style: "boldTableCell",
                },
                {},
                {},
                {},
                total,
              ],
              [
                { text: "DESCONTO", colSpan: 4, style: "boldTableCell" },
                {},
                {},
                {},
                req.body.discount,
              ],
              [
                {
                  text: "TOTAL SEM DESCONTO",
                  colSpan: 4,
                  style: "boldTableCell",
                },
                {},
                {},
                {},
                total - req.body.discount,
              ],
            ],
          },
          style: "mainTable",
        },
        {
          text: "DATA DE PAGAMENTO: ",
          margin: [0, 20, 0, 0],
        },
        {
          text: paymentDay,
          decoration: "underline",
        },
      ],
      styles: {
        header: {
          margin: [0, 0, 0, 20],
        },
        miniTable: {
          margin: [0, 20, 0, 20],
        },
        tableHeader: {
          bold: true,
          fillColor: "#f2f2f2",
          alignment: "center",
          margin: [0, 5],
        },
        boldTableCell: {
          bold: true,
          margin: [0, 5],
        },
        mainTable: {
          margin: [0, 20, 0, 20],
          fontSize: 10,
          cellPadding: {
            top: 5,
            bottom: 5,
          },
        },
      },
    };
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    const chunks: Buffer[] = [];
    pdfDoc.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    // When the document is finished, concatenate and send the response
    pdfDoc.on("end", () => {
      const result = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="document.pdf"'
      );
      res.send(result);
    });

    pdfDoc.end();
  } else {
    res.status(404).json({ message: "Not found" });
  }
}
