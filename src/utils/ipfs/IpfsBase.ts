export function ProvideBase(
  status: string,
  address: string,
  data: string,
  index: number,
) {
  const body = {
    description: 'This is the OWL Progress Badge',
    externalUrl: 'https://github.com/OWLSuperhack/owl-world-backend',
    image: '',
    name: 'OWL Progress Badge',
    status,
    attributes: [
      {
        value: status,
        trait_type: 'Status',
      },
      {
        trait_type: 'Address',
        value: address,
      }
    ]
  }
  switch (index) {
    case 0:
      body.image = ProvideImage(0)
      break
    case 6:
      body.image = ProvideImage(1)
      break
    case 10:
      body.image = ProvideImage(2)
      break
    case 11:
      body.image = ProvideImage(3)
      break
    default:
      body.image = ProvideImage(0)
      break
  }
  return body
}
function ProvideImage(index: number) {
  switch (index) {
    case 0:
      return 'https://amethyst-total-vicuna-396.mypinata.cloud/ipfs/QmZXeLAXPGbB79GLpdKpS9qYRcsp6hE6BvoGBwiqZGpfu2'
      break
    case 1:
      return 'https://amethyst-total-vicuna-396.mypinata.cloud/ipfs/QmVgj2eMNvjDbccDspwjJYLLoYLNMPN2HPdgqBarqZDhtn'
      break
    case 2:
      return 'https://amethyst-total-vicuna-396.mypinata.cloud/ipfs/QmczVotoscBCNcL4wLng1YbSkMUTW3x4ZGfTKG1bLQco6J'
      break
    case 3:
      return 'https://amethyst-total-vicuna-396.mypinata.cloud/ipfs/QmPTTuYMcwpixkRvFzBJrcQKb4PicuX3uYVqV7jKZY3Gh8'
      break
    default:
      return 'https://amethyst-total-vicuna-396.mypinata.cloud/ipfs/QmZXeLAXPGbB79GLpdKpS9qYRcsp6hE6BvoGBwiqZGpfu2'
      break
  }
}
