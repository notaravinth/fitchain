;; escrow contract

;; imports
(use-trait ft-trait .sip-010-trait.sip-010-trait)

;; constants and errors
(define-constant err-invalid-challenge (err u100))
(define-constant err-challenge-exists (err u101))
(define-constant err-challenge-not-exists (err u102))
(define-constant err-already-has-participant (err u103))
(define-constant err-stake-mismatch (err u104))
(define-constant err-already-completed (err u105))
(define-constant err-invalid-winner (err u106))

;; data structures
(define-map challenges
    uint
    {
        creator: principal,
        participant: (optional principal),
        stake: uint,
        completed: bool,
        winner: (optional principal)
    }
)

(define-data-var next-challenge-id uint u0)

;; events
(define-private (emit-challenge-created (challenge-id uint) (creator principal) (stake uint))
    (print {event: "challenge-created", challenge-id: challenge-id, creator: creator, stake: stake})
)

(define-private (emit-challenge-joined (challenge-id uint) (participant principal))
    (print {event: "challenge-joined", challenge-id: challenge-id, participant: participant})
)

(define-private (emit-challenge-resolved (challenge-id uint) (winner principal))
    (print {event: "challenge-resolved", challenge-id: challenge-id, winner: winner})
)

;; P2P Challenge functions
(define-public (create-p2p-challenge (stake uint))
    (let 
        (
            (challenge-id (var-get next-challenge-id))
        )
        (map-insert challenges challenge-id {
            creator: tx-sender,
            participant: none,
            stake: stake,
            completed: false,
            winner: none
        })
        (var-set next-challenge-id (+ challenge-id u1))
        (try! (stx-transfer? stake tx-sender (as-contract tx-sender)))
        (emit-challenge-created challenge-id tx-sender stake)
        (ok challenge-id)
    )
)

(define-public (join-p2p-challenge (challenge-id uint))
    (let 
        (
            (challenge (unwrap! (map-get? challenges challenge-id) err-challenge-not-exists))
        )
        (asserts! (is-none (get participant challenge)) err-already-has-participant)
        (asserts! (not (get completed challenge)) err-already-completed)
        (try! (stx-transfer? (get stake challenge) tx-sender (as-contract tx-sender)))
        (map-set challenges challenge-id (merge challenge {participant: (some tx-sender)}))
        (emit-challenge-joined challenge-id tx-sender)
        (ok true)
    )
)

(define-public (resolve-p2p-challenge (challenge-id uint))
    (let 
        (
            (challenge (unwrap! (map-get? challenges challenge-id) err-challenge-not-exists))
            (stake-amount (* (get stake challenge) u2))
        )
        (asserts! (not (get completed challenge)) err-already-completed)
        (asserts! (or (is-eq tx-sender (get creator challenge)) (is-eq tx-sender (unwrap! (get participant challenge) err-invalid-challenge))) err-invalid-winner)
        (map-set challenges challenge-id (merge challenge {
            completed: true,
            winner: (some tx-sender)
        }))
        (try! (as-contract (stx-transfer? stake-amount (as-contract tx-sender) tx-sender)))
        (emit-challenge-resolved challenge-id tx-sender)
        (ok true)
    )
)

;; P2C Challenge functions
(define-public (create-p2c-challenge)
    (let 
        (
            (challenge-id (var-get next-challenge-id))
            (min-stake u100000) ;; 0.0001 STX
        )
        (map-insert challenges challenge-id {
            creator: (as-contract tx-sender),
            participant: (some tx-sender),
            stake: min-stake,
            completed: false,
            winner: none
        })
        (var-set next-challenge-id (+ challenge-id u1))
        (emit-challenge-created challenge-id tx-sender min-stake)
        (ok challenge-id)
    )
)

(define-public (resolve-p2c-challenge (challenge-id uint))
    (let 
        (
            (challenge (unwrap! (map-get? challenges challenge-id) err-challenge-not-exists))
        )
        (asserts! (not (get completed challenge)) err-already-completed)
        (asserts! (or (is-eq tx-sender (get creator challenge)) (is-eq tx-sender (unwrap! (get participant challenge) err-invalid-challenge))) err-invalid-winner)
        (map-set challenges challenge-id (merge challenge {
            completed: true,
            winner: (some tx-sender)
        }))
        (emit-challenge-resolved challenge-id tx-sender)
        (ok true)
    )
)

;; read-only functions
(define-read-only (get-challenge (challenge-id uint))
    (map-get? challenges challenge-id)
)

(define-read-only (get-next-challenge-id)
    (ok (var-get next-challenge-id))
)

