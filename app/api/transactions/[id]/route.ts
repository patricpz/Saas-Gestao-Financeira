import { NextResponse, type NextRequest } from 'next/server'
import { updateTransaction, deleteTransaction, getTransactionById } from '@/lib/transactions/service'

export const GET = async (request: NextRequest, context: any) => {
  try {
    const userId = request.headers.get('x-user-id')
    const { id } = context.params

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const transaction = await getTransactionById(id, userId)
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 })
  }
}

export const PUT = async (request: NextRequest, context: any) => {
  try {
    const userId = request.headers.get('x-user-id')
    const { id } = context.params
    const body = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const updated = await updateTransaction(id, userId, body)
    if (!updated) {
      return NextResponse.json({ error: 'Transaction not found or access denied' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
  }
}

export const DELETE = async (request: NextRequest, context: any) => {
  try {
    const userId = request.headers.get('x-user-id')
    const { id } = context.params

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const ok = await deleteTransaction(id, userId)
    if (!ok) {
      return NextResponse.json({ error: 'Transaction not found or access denied' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 })
  }
}
