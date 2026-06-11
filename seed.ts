import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding CleanPro database...')

  // Settings
  const settingsData = [
    { key: 'company_name',    value: 'CleanPro Services Sdn Bhd' },
    { key: 'company_phone',   value: '+60 12-345 6789' },
    { key: 'company_email',   value: 'hello@cleanpro.com.my' },
    { key: 'company_address', value: 'No. 12, Jalan Maju 5, Taman Klang Jaya, 41150 Klang, Selangor' },
    { key: 'company_ssm',     value: 'SA0012345-X' },
    { key: 'currency',        value: 'RM' },
    { key: 'tax_rate',        value: '0' },
    { key: 'invoice_prefix',  value: 'INV' },
    { key: 'quote_prefix',    value: 'QT' },
    { key: 'payment_terms',   value: 'Payment due within 14 days of invoice date.' },
    { key: 'notif_job_reminders',    value: 'true' },
    { key: 'notif_invoice_due',      value: 'true' },
    { key: 'notif_payment_received', value: 'true' },
    { key: 'notif_new_quote',        value: 'true' },
    { key: 'notif_daily_report',     value: 'true' },
  ]
  for (const s of settingsData) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s })
  }
  console.log('✓ Settings seeded')

  // Users
  const adminPw  = await bcrypt.hash('admin123',  10)
  const staffPw  = await bcrypt.hash('staff123',  10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cleanpro.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@cleanpro.com', password: adminPw, role: 'admin' },
  })
  const manager = await prisma.user.upsert({
    where: { email: 'manager@cleanpro.com' },
    update: {},
    create: { name: 'Sarah Manager', email: 'manager@cleanpro.com', password: staffPw, role: 'manager' },
  })
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@cleanpro.com' },
    update: {},
    create: { name: 'John Staff', email: 'staff@cleanpro.com', password: staffPw, role: 'staff' },
  })
  console.log('✓ Users seeded (admin@cleanpro.com / admin123)')

  // Staff
  const staffList = [
    { name: 'Kokoy',  phone: '+60 12-111 2233', role: 'cleaner',    area: 'Telok Gadong / Port Klang', colorCode: 'teal',   status: 'active' },
    { name: 'Santi',  phone: '+60 12-222 3344', role: 'cleaner',    area: 'Teluk Pulai',               colorCode: 'amber',  status: 'active' },
    { name: 'Suci',   phone: '+60 12-333 4455', role: 'cleaner',    area: 'Tmn Klang Jaya',            colorCode: 'green',  status: 'active' },
    { name: 'Rika',   phone: '+60 12-444 5566', role: 'cleaner',    area: 'Telok Gadong',              colorCode: 'purple', status: 'active' },
    { name: 'Maria',  phone: '+60 12-555 6677', role: 'cleaner',    area: 'Bukit Tinggi / Teluk Pulai',colorCode: 'pink',   status: 'active' },
    { name: 'Ali',    phone: '+60 12-666 7788', role: 'driver',     area: 'All Areas',                  colorCode: 'blue',   status: 'active' },
    { name: 'Rachel', phone: '+60 12-777 8899', role: 'supervisor', area: 'Klang / Shah Alam',         colorCode: 'orange', status: 'active' },
  ]
  const createdStaff: any[] = []
  for (const s of staffList) {
    const existing = await prisma.staff.findFirst({ where: { phone: s.phone } })
    if (!existing) {
      const st = await prisma.staff.create({ data: s })
      createdStaff.push(st)
    } else {
      createdStaff.push(existing)
    }
  }
  console.log('✓ Staff seeded')

  // Clients
  const clientsData = [
    { name: 'Mrs. Lim Ah Kow',  phone: '+60 12-100 1001', email: 'lim@example.com', address: '12, Jalan Bahagia 3, Taman Bahagia',    area: 'Telok Gadong',   frequency: 'weekly',   status: 'active' },
    { name: 'Tan Family',       phone: '+60 12-200 2002', email: '',                address: '45, Lorong Indah 7, Tmn Klang Jaya',    area: 'Klang Jaya',     frequency: 'biweekly', status: 'active' },
    { name: 'Ahmad bin Yusof',  phone: '+60 12-300 3003', email: '',                address: '88, Jalan Maju 5, Taman Maju',           area: 'Teluk Pulai',    frequency: 'monthly',  status: 'active' },
    { name: 'Wong & Co Office', phone: '+60 12-400 4004', email: 'wong@biz.com',   address: 'A-5-2, Plaza Klang, Jalan Gombak',       area: 'Port Klang',     frequency: 'weekly',   status: 'active', company: 'Wong & Associates' },
    { name: 'Puan Rosmah',      phone: '+60 12-500 5005', email: '',                address: '7, Jalan Anggerik, Taman Anggerik Emas', area: 'Bukit Tinggi',   frequency: 'biweekly', status: 'active' },
    { name: 'Dr. Priya Sharma', phone: '+60 12-600 6006', email: 'priya@mail.com', address: '23, Jalan Sejahtera 2, Taman Sejahtera', area: 'Shah Alam',      frequency: 'monthly',  status: 'active' },
    { name: 'Mdm. Lee Siew Kee',phone: '+60 12-700 7007', email: '',                address: '101, Jalan Sri Muda 4A, Sri Muda',       area: 'Shah Alam',      frequency: 'weekly',   status: 'active' },
    { name: 'Mr. Ravi Pillai',  phone: '+60 12-800 8008', email: '',                address: '55, Jalan Tiara 3, Tiara Klang',         area: 'Klang',          frequency: 'once',     status: 'inactive' },
  ]
  const createdClients: any[] = []
  for (const c of clientsData) {
    const existing = await prisma.client.findFirst({ where: { phone: c.phone } })
    if (!existing) {
      const cl = await prisma.client.create({ data: { ...c, email: c.email || undefined, company: (c as any).company || undefined } })
      createdClients.push(cl)
    } else {
      createdClients.push(existing)
    }
  }
  console.log('✓ Clients seeded')

  // Jobs for current week
  const today = new Date()
  const mon = new Date(today)
  mon.setDate(today.getDate() - today.getDay() + 1)

  const jobTemplates = [
    { dayOff: 0, staffIdx: 0, clientIdx: 0, start: '08:00', end: '11:00', service: 'regular', status: 'completed' },
    { dayOff: 0, staffIdx: 1, clientIdx: 1, start: '09:00', end: '13:00', service: 'deep',    status: 'completed' },
    { dayOff: 1, staffIdx: 2, clientIdx: 2, start: '08:30', end: '12:30', service: 'regular', status: 'completed' },
    { dayOff: 1, staffIdx: 0, clientIdx: 3, start: '14:00', end: '17:00', service: 'office',  status: 'scheduled' },
    { dayOff: 2, staffIdx: 3, clientIdx: 4, start: '08:00', end: '11:30', service: 'regular', status: 'scheduled' },
    { dayOff: 2, staffIdx: 1, clientIdx: 5, start: '13:00', end: '16:00', service: 'deep',    status: 'scheduled' },
    { dayOff: 3, staffIdx: 4, clientIdx: 6, start: '09:00', end: '12:00', service: 'regular', status: 'scheduled' },
    { dayOff: 4, staffIdx: 0, clientIdx: 0, start: '08:00', end: '11:00', service: 'regular', status: 'scheduled' },
    { dayOff: 4, staffIdx: 2, clientIdx: 2, start: '13:00', end: '16:00', service: 'regular', status: 'scheduled' },
  ]

  let jobCount = await prisma.job.count()
  for (const j of jobTemplates) {
    if (jobCount >= 50) break
    const date = new Date(mon)
    date.setDate(mon.getDate() + j.dayOff)
    const staff = createdStaff[j.staffIdx]
    const client = createdClients[j.clientIdx]
    if (!staff || !client) continue
    const existing = await prisma.job.findFirst({ where: { clientId: client.id, staffId: staff.id, date: { gte: new Date(date.setHours(0,0,0,0)), lt: new Date(date.setHours(23,59,59,999)) } } })
    if (!existing) {
      await prisma.job.create({ data: {
        jobNumber: `JOB-${String(++jobCount).padStart(4,'0')}`,
        clientId: client.id, staffId: staff.id,
        date: date, startTime: j.start, endTime: j.end,
        serviceType: j.service, frequency: 'weekly', status: j.status, priority: 'normal',
      }})
    }
  }
  console.log('✓ Jobs seeded')

  // Invoices
  const invCount = await prisma.invoice.count()
  if (invCount === 0 && createdClients.length > 0) {
    const year = new Date().getFullYear()
    const invData = [
      { clientIdx: 0, total: 180,  paid: 180, status: 'paid',    daysAgo: 30 },
      { clientIdx: 1, total: 320,  paid: 150, status: 'partial', daysAgo: 14 },
      { clientIdx: 2, total: 220,  paid: 0,   status: 'pending', daysAgo: 7  },
      { clientIdx: 3, total: 480,  paid: 0,   status: 'overdue', daysAgo: 45 },
      { clientIdx: 4, total: 160,  paid: 160, status: 'paid',    daysAgo: 20 },
      { clientIdx: 5, total: 260,  paid: 0,   status: 'pending', daysAgo: 3  },
    ]
    let n = 0
    for (const iv of invData) {
      const client = createdClients[iv.clientIdx]
      if (!client) continue
      const issue = new Date(); issue.setDate(issue.getDate() - iv.daysAgo)
      const due = new Date(issue); due.setDate(due.getDate() + 14)
      await prisma.invoice.create({ data: {
        number: `INV-${year}-${String(++n).padStart(4,'0')}`,
        clientId: client.id,
        issueDate: issue, dueDate: due,
        subtotal: iv.total, taxRate: 0, tax: 0, discount: 0,
        total: iv.total, amountPaid: iv.paid, balance: iv.total - iv.paid,
        status: iv.status,
        items: { create: [{ description: 'Cleaning Service', quantity: 1, unitPrice: iv.total, total: iv.total }] },
      }})
    }
    console.log('✓ Invoices seeded')
  }

  // Payments
  const payCount = await prisma.payment.count()
  if (payCount === 0 && createdClients.length > 0) {
    const payData = [
      { clientIdx: 0, amount: 180, method: 'cash' },
      { clientIdx: 1, amount: 150, method: 'tng' },
      { clientIdx: 4, amount: 160, method: 'bank_transfer' },
    ]
    for (const p of payData) {
      const client = createdClients[p.clientIdx]
      if (!client) continue
      await prisma.payment.create({ data: { clientId: client.id, amount: p.amount, method: p.method, date: new Date() } })
    }
    console.log('✓ Payments seeded')
  }

  // Expenses
  const expCount = await prisma.expense.count()
  if (expCount === 0) {
    const expData = [
      { category: 'fuel',     description: 'Petrol for weekly routes',      amount: 85,  staffIdx: 5 },
      { category: 'supplies', description: 'Cleaning agents & mop heads',   amount: 120, staffIdx: null },
      { category: 'fuel',     description: 'Petrol - weekend jobs',          amount: 60,  staffIdx: 5 },
      { category: 'equipment',description: 'Vacuum cleaner replacement bag', amount: 35,  staffIdx: null },
      { category: 'transport',description: 'Toll charges for the week',      amount: 22,  staffIdx: 0 },
    ]
    for (const e of expData) {
      const staff = e.staffIdx !== null ? createdStaff[e.staffIdx] : null
      await prisma.expense.create({ data: { staffId: staff?.id, category: e.category, description: e.description, amount: e.amount, approved: true } })
    }
    console.log('✓ Expenses seeded')
  }

  // Quotes
  const qtCount = await prisma.quote.count()
  if (qtCount === 0) {
    const quotesData = [
      { clientName: 'Mrs. Tan Bee Leng', clientPhone: '+60 12-900 9000', serviceType: 'deep', amount: 380, status: 'pending' },
      { clientName: 'Encik Faridz', clientPhone: '+60 12-901 9001', serviceType: 'post-reno', amount: 650, status: 'accepted' },
      { clientName: 'New Prospect', clientPhone: '+60 12-902 9002', serviceType: 'regular', amount: 160, status: 'rejected' },
    ]
    let qn = 0
    for (const q of quotesData) {
      const valid = new Date(); valid.setDate(valid.getDate() + 14)
      await prisma.quote.create({ data: { number: `QT-${String(++qn).padStart(3,'0')}`, ...q, validUntil: valid } })
    }
    console.log('✓ Quotes seeded')
  }

  // Audit logs
  await prisma.auditLog.createMany({
    skipDuplicates: false,
    data: [
      { userId: admin.id, action: 'create', resource: 'client', details: '{"name":"Mrs. Lim Ah Kow"}' },
      { userId: admin.id, action: 'create', resource: 'job',    details: '{"status":"scheduled"}' },
      { userId: manager.id, action: 'create', resource: 'invoice', details: '{"total":180}' },
      { userId: manager.id, action: 'update', resource: 'invoice', details: '{"status":"paid"}' },
    ],
  })

  // Welcome notification for admin
  const notifCount = await prisma.notification.count()
  if (notifCount === 0) {
    await prisma.notification.createMany({
      data: [
        { userId: admin.id, title: 'Welcome to CleanPro!', message: 'Your management system is ready. Start by adding clients and scheduling jobs.', type: 'success' },
        { userId: admin.id, title: 'Overdue Invoice Alert', message: 'You have 1 overdue invoice. Please follow up with the client.', type: 'warning' },
        { userId: admin.id, title: 'New Quote Request', message: 'Encik Faridz has accepted a quote for post-renovation cleaning.', type: 'info' },
      ],
    })
  }

  console.log('\n✅ Database seeded successfully!')
  console.log('📧 Admin login: admin@cleanpro.com / admin123')
  console.log('📧 Manager login: manager@cleanpro.com / staff123')
  console.log('📧 Staff login: staff@cleanpro.com / staff123')
}

main()
  .catch(e => { console.error('Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
