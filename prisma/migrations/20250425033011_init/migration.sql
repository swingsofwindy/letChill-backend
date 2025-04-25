-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CREATOR', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "MaNguoiDung" TEXT NOT NULL,
    "TenNguoiDung" TEXT,
    "NgaySinh" TIMESTAMP(3),
    "GioiTinh" TEXT,
    "Email" TEXT NOT NULL,
    "AvatarUrl" TEXT,
    "Role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("MaNguoiDung")
);

-- CreateTable
CREATE TABLE "DanhSachPhat" (
    "MaDanhSach" SERIAL NOT NULL,
    "MaNguoiDung" TEXT NOT NULL,
    "TenDanhSach" TEXT NOT NULL,
    "AvatarUrl" TEXT,
    "NgayDang" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DanhSachPhat_pkey" PRIMARY KEY ("MaDanhSach")
);

-- CreateTable
CREATE TABLE "CT_DanhSachPhat" (
    "MaDanhSach" INTEGER NOT NULL,
    "MaBaiHat" INTEGER NOT NULL,
    "NgayThem" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CT_DanhSachPhat_pkey" PRIMARY KEY ("MaDanhSach","MaBaiHat")
);

-- CreateTable
CREATE TABLE "BaiHat" (
    "MaBaiHat" SERIAL NOT NULL,
    "MaNhacSi" INTEGER NOT NULL,
    "MaTheLoai" INTEGER NOT NULL,
    "MaNgheSi" INTEGER NOT NULL,
    "MaNguoiDang" TEXT NOT NULL,
    "TenBaiHat" TEXT NOT NULL,
    "BaiHatUrl" TEXT,
    "DownloadUrl" TEXT,
    "AvatarUrl" TEXT,
    "LoiBaiHat" TEXT,
    "NgayDang" TIMESTAMP(3) NOT NULL,
    "LuotNghe" INTEGER NOT NULL,
    "TienDo" INTEGER,

    CONSTRAINT "BaiHat_pkey" PRIMARY KEY ("MaBaiHat")
);

-- CreateTable
CREATE TABLE "NhacSi" (
    "MaNhacSi" SERIAL NOT NULL,
    "TenNhacSi" TEXT NOT NULL,

    CONSTRAINT "NhacSi_pkey" PRIMARY KEY ("MaNhacSi")
);

-- CreateTable
CREATE TABLE "TheLoai" (
    "MaTheLoai" SERIAL NOT NULL,
    "TenTheLoai" TEXT NOT NULL,

    CONSTRAINT "TheLoai_pkey" PRIMARY KEY ("MaTheLoai")
);

-- CreateTable
CREATE TABLE "NgheSi" (
    "MaNgheSi" SERIAL NOT NULL,
    "TenNgheSi" TEXT NOT NULL,
    "AvatarUrl" TEXT,

    CONSTRAINT "NgheSi_pkey" PRIMARY KEY ("MaNgheSi")
);

-- CreateTable
CREATE TABLE "DanhGia" (
    "MaDanhGia" SERIAL NOT NULL,
    "MaNguoiDung" TEXT NOT NULL,
    "MaBaiHat" INTEGER NOT NULL,
    "MucDanhGia" INTEGER NOT NULL,
    "BinhLuan" TEXT,

    CONSTRAINT "DanhGia_pkey" PRIMARY KEY ("MaDanhGia")
);

-- CreateTable
CREATE TABLE "TheoDoi" (
    "MaNgheSi" INTEGER NOT NULL,
    "MaNguoiDung" TEXT NOT NULL,

    CONSTRAINT "TheoDoi_pkey" PRIMARY KEY ("MaNgheSi","MaNguoiDung")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- AddForeignKey
ALTER TABLE "DanhSachPhat" ADD CONSTRAINT "DanhSachPhat_MaNguoiDung_fkey" FOREIGN KEY ("MaNguoiDung") REFERENCES "User"("MaNguoiDung") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CT_DanhSachPhat" ADD CONSTRAINT "CT_DanhSachPhat_MaDanhSach_fkey" FOREIGN KEY ("MaDanhSach") REFERENCES "DanhSachPhat"("MaDanhSach") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CT_DanhSachPhat" ADD CONSTRAINT "CT_DanhSachPhat_MaBaiHat_fkey" FOREIGN KEY ("MaBaiHat") REFERENCES "BaiHat"("MaBaiHat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaiHat" ADD CONSTRAINT "BaiHat_MaNhacSi_fkey" FOREIGN KEY ("MaNhacSi") REFERENCES "NhacSi"("MaNhacSi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaiHat" ADD CONSTRAINT "BaiHat_MaTheLoai_fkey" FOREIGN KEY ("MaTheLoai") REFERENCES "TheLoai"("MaTheLoai") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaiHat" ADD CONSTRAINT "BaiHat_MaNgheSi_fkey" FOREIGN KEY ("MaNgheSi") REFERENCES "NgheSi"("MaNgheSi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DanhGia" ADD CONSTRAINT "DanhGia_MaNguoiDung_fkey" FOREIGN KEY ("MaNguoiDung") REFERENCES "User"("MaNguoiDung") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DanhGia" ADD CONSTRAINT "DanhGia_MaBaiHat_fkey" FOREIGN KEY ("MaBaiHat") REFERENCES "BaiHat"("MaBaiHat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheoDoi" ADD CONSTRAINT "TheoDoi_MaNgheSi_fkey" FOREIGN KEY ("MaNgheSi") REFERENCES "NgheSi"("MaNgheSi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TheoDoi" ADD CONSTRAINT "TheoDoi_MaNguoiDung_fkey" FOREIGN KEY ("MaNguoiDung") REFERENCES "User"("MaNguoiDung") ON DELETE RESTRICT ON UPDATE CASCADE;
