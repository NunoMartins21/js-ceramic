import type { CeramicApi, CeramicDocument } from './types'

class DIDDocument {
  constructor (public ceramicDoc: CeramicDocument, private _ceramic: CeramicApi) { }

  get did (): string {
    return 'did:3:' + this.ceramicDoc.state.log[0]
  }

  async linkAccount () { }

  static async get (did: string, ceramic: CeramicApi): Promise<DIDDocument> {
    const didPrefix = 'did:3:'
    if (!did.startsWith(didPrefix)) {
      throw new Error('Only 3IDs allowed')
    }
    const cid = did.slice(didPrefix.length)
    const ceramicDoc = await ceramic.loadDocument(`/ceramic/${cid}`)
    return new DIDDocument(ceramicDoc, ceramic)
  }

  static async build (keys: {managementKey: string; signingKey: string; encryptionKey: string; }, ceramic: CeramicApi): Promise<DIDDocument> {
    const ceramicDoc = await ceramic.createDocument({
      publicKeys: {
        signing: keys.signingKey,
        encryption: keys.encryptionKey
      }
    }, '3id', { owners: [keys.managementKey] })
    return new DIDDocument(ceramicDoc, ceramic)
  }
}

export default DIDDocument
