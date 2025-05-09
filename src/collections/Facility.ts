import { CollectionConfig } from 'payload'

export const Facility: CollectionConfig = {
  slug: 'facility',
  labels: {
    singular: 'Fasilitas',
    plural: 'Fasilitas',
  },
  admin: {
    description: 'Hanya 5 Konten Yang Pertama Tampil',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'name',
      label: 'Nama',
      type: 'text',
      required: true,
    },
    {
      name: 'enName',
      label: 'English Name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Deskripsi',
      type: 'text',
      required: true,
    },
  ],
}
