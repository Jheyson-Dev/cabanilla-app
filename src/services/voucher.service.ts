import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
  getDoc,
  Timestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export interface VoucherItem {
  name: string;
  quantity: string;
  total: string;
}

export interface FuelVoucher {
  id?: string;
  number?: string;
  date?: string;
  office: string;
  description: string;
  requester: string;
  operator: string;
  meta: string;
  vehicle: string;
  items: VoucherItem[];
  activity: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  firmas?: {
    [key: string]: {
      usuario_id: string;
      fecha_firma: string | null;
    };
  };
}

export const getVouchers = async (): Promise<FuelVoucher[]> => {
  try {
    const vouchersCollection = collection(db, "vales");
    const snapshot = await getDocs(vouchersCollection);

    const vouchers = snapshot.docs.map((doc) => {
      const data = doc.data();
      const voucher: FuelVoucher = {
        id: doc.id,
        number: data.number,
        date: data.date,
        office: data.office,
        description: data.description,
        requester: data.requester,
        operator: data.operator,
        meta: data.meta,
        vehicle: data.vehicle,
        items: data.items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          total: item.total,
        })),
        activity: data.activity,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        firmas: data.firmas,
      };
      return voucher;
    });

    return vouchers;
  } catch (error) {
    console.error("Error fetching vouchers: ", error);
    throw error;
  }
};

export const createVoucher = async (voucher: FuelVoucher) => {
  try {
    const vouchersCollection = collection(db, "vales");

    // Obtener el último número de voucher
    const lastVoucherQuery = query(
      vouchersCollection,
      orderBy("number", "desc"),
      limit(1)
    );
    const lastVoucherSnapshot = await getDocs(lastVoucherQuery);

    let newNumber = "1";
    if (!lastVoucherSnapshot.empty) {
      const lastVoucher = lastVoucherSnapshot.docs[0].data();
      newNumber = (parseInt(lastVoucher.number) + 1).toString();
    }

    const newVoucher = {
      ...voucher,
      number: newNumber,
      date: new Date().toISOString().split("T")[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(vouchersCollection, newVoucher);
    return { id: docRef.id, ...newVoucher };
  } catch (error) {
    console.error("Error creating voucher: ", error);
    throw error;
  }
};

export const updateVoucher = async (
  id: string,
  voucher: Partial<FuelVoucher>
) => {
  try {
    const voucherDoc = doc(db, "vales", id);
    await updateDoc(voucherDoc, {
      ...voucher,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating voucher: ", error);
    throw error;
  }
};

export const getVoucherById = async (id: string): Promise<FuelVoucher> => {
  try {
    const voucherDoc = doc(db, "vales", id);
    const voucherSnapshot = await getDoc(voucherDoc);

    if (!voucherSnapshot.exists()) {
      throw new Error("Voucher not found");
    }
    const data = voucherSnapshot.data();
    const voucher: FuelVoucher = {
      id: voucherSnapshot.id,
      number: data.number,
      date: data.date,
      office: data.office,
      description: data.description,
      requester: data.requester,
      operator: data.operator,
      meta: data.meta,
      vehicle: data.vehicle,
      items: data.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        total: item.total,
      })),
      activity: data.activity,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      firmas: data.firmas,
    };

    return voucher;
  } catch (error) {
    console.error("Error fetching voucher: ", error);
    throw error;
  }
};

export const deleteVoucher = async (id: string): Promise<void> => {
  try {
    const voucherDoc = doc(db, "vales", id);
    await deleteDoc(voucherDoc);
  } catch (error) {
    console.error("Error deleting voucher: ", error);
    throw error;
  }
};

export const addSignatureToVoucher = async (
  id: string,
  signatureKey: string,
  signature: {
    usuario_id: string;
    fecha_firma: string | null;
  }
) => {
  try {
    const voucherDoc = doc(db, "vales", id);
    const voucherSnapshot = await getDoc(voucherDoc);

    if (!voucherSnapshot.exists()) {
      throw new Error("Voucher not found");
    }

    const existingData = voucherSnapshot.data();
    const existingFirmas = existingData.firmas || {};

    const updatedFirmas = {
      ...existingFirmas,
      [signatureKey]: signature,
    };

    await updateDoc(voucherDoc, {
      firmas: updatedFirmas,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding signature to voucher: ", error);
    throw error;
  }
};