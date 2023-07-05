import { NextApiRequest, NextApiResponse } from "next";
const pdf = require("pdf-creator-node");
const fs = require("fs");
const moment = require("moment");

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  if (req.method === "POST") {
    const cost = (service: string, quantity: number) => {
      var cost = 0;
      service === "Diária" ? (cost = 80 * quantity) : (cost = 15 * quantity);
      return cost;
    };

    var html = fs.readFileSync("public/html/page.html", "utf8");

    var total = 0;

    const table = req.body.table.map((current: DailyWorkersManagementForm) => {
      total += cost(current.service, current.quantity);
      return {
        week: current.week,
        dailyWorker: current.dailyWorker,
        bankInfo: current.bankInfo,
        service: current.service,
        quantity: current.quantity,
        total: cost(current.service, current.quantity),
        paymentDay: current.paymentDay,
      };
    });

    var week = { start: "", end: "" };
    const yearString = table[0].week.substr(0, 4); // Extract the year from the string
    const weekString = table[0].week.substr(6); // Extract the week from the string

    // Get the first day of the week
    week.start = moment(`${yearString}-W${weekString}`)
      .startOf("isoWeek")
      .format("DD/MM/YYYY");

    // Get the last day of the week
    week.end = moment(`${yearString}-W${weekString}`)
      .endOf("isoWeek")
      .format("DD/MM/YYYY");

    const paymentDay = moment(table[0].paymentDay).format("DD/MM/YYYY");

    const logoB64Content = fs.readFileSync("public/images/logo.png", {
      encoding: "base64",
    });
    const logoSrc = "data:image/jpeg;base64," + logoB64Content;

    var document = {
      html: html,
      data: {
        table,
        week,
        total,
        discount: req.body.discount,
        totalFinal: total - req.body.discount,
        paymentDay,
        logoSrc,
      },
      path: "./output.pdf",
      type: "",
    };

    var options = {
      format: "A4",
      orientation: "portrait",
      border: "20mm",
    };

    pdf
      .create(document, options)
      .then((result: any) => {
        console.log(result);
        // PDF created successfully, you can send a response or perform any other actions here
        res.status(200).json({ message: "PDF created successfully" });
      })
      .catch((error: any) => {
        console.error(error);
        // Handle any errors that occurred during PDF generation
        res.status(500).json({ message: "PDF generation failed" });
      });
  } else {
    res.status(404).json({ message: "Not found" });
  }
}
