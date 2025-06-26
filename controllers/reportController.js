const transporter = require("../utils/mailer");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendReportEmail = async (req, res) => {
  const { email, content } = req.body;

  if (!email) {
    return res.status(400).json({ error: "EMAIL_NOT_FOUND" });
  }
  if (!content) {
    return res.status(400).json({ error: "CONTENT_NOT_FOUND" });
  }
  if (content.length > 1000) {
    return res.status(400).json({ error: "CONTENT_TOO_LONG" });
  }

  try {
    const time = new Date().toLocaleString();

    // Gửi mail tới admin/dev
    await transporter.sendMail({
      from: `"Letchill - No Reply" <${process.env.WEB_MAIL}>`,
      to: process.env.DEV_MAIL,
      subject: `📢 Báo cáo từ người dùng ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; background-color: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #333;">📨 Báo cáo mới từ người dùng</h2>
          <p><strong>Email người gửi:</strong> ${email}</p>
          <p><strong>Thời gian:</strong> ${time}</p>
          <p><strong>Nội dung báo cáo:</strong></p>
          <div style="white-space: pre-line; padding: 12px; background-color: #fff; border: 1px solid #ddd; border-radius: 6px; color: #444;">
            ${content}
          </div>
          <p style="margin-top: 20px; font-size: 13px; color: #888;">
            Email này được gửi tự động từ hệ thống Letchill.
          </p>
        </div>
      `,
    });

    // Gửi mail cảm ơn người dùng
    await transporter.sendMail({
      from: `"Letchill - No Reply" <${process.env.WEB_MAIL}>`,
      to: email,
      subject: "🎵 Cảm ơn bạn đã gửi báo cáo",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; background-color: #ffffff; border-radius: 8px; border: 1px solid #eee;">
          <h2 style="color: #4caf50;">💚 Cảm ơn bạn đã phản hồi!</h2>
          <p>Chúng tôi đã nhận được báo cáo của bạn với nội dung:</p>
          <blockquote style="background-color: #f9f9f9; padding: 12px; border-left: 4px solid #4caf50;">
            ${content}
          </blockquote>
          <p>Đội ngũ Letchill sẽ xem xét và cải thiện hệ thống sớm nhất.</p>
          <p style="margin-top: 20px; font-size: 13px; color: #888;">
            Đây là email tự động. Vui lòng không trả lời lại.
          </p>
        </div>
      `,
    });

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createReportSong = async (req, res) => {
  const songId = parseInt(req.params.id, 10);
  const uid = req.params.uid;
  const { email, reason, type } = req.body;

  try {
    await prisma.baoCao.create({
      data: {
        Email: email,
        LyDo: reason,
        LoaiBaoCao: type,
        MaBaiHat: songId,
        MaNguoiDung: uid,
      }
    })

    res.status(200).json();

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}

const getAllReport = async (req, res) => {
  try {
    const reports = await prisma.baoCao.findMany();
    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
}

const deleteReport = async (req, res) => {
  const reportId = parseInt(req.params.id, 10);
  try {
    await prisma.baoCao.delete({
      where: {
        MaBaoCao: reportId
      }
    })
    res.status(200).json();
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

module.exports = {
  sendReportEmail,
  createReportSong,
  getAllReport,
  deleteReport
};
