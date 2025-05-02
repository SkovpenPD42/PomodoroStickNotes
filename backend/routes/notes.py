from flask import Blueprint, request, jsonify
from database.models import db, Note


notes_bp = Blueprint('notes', __name__)

@notes_bp.route('', methods=['GET'])
def get_notes():
    notes = Note.query.all()
    return jsonify([{'id': note.id, 'text': note.text} for note in notes])

@notes_bp.route('', methods=['POST'])
def add_note():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'Invalid request'}), 400
    new_note = Note(text=data['text'])
    db.session.add(new_note)
    db.session.commit()
    return jsonify({'id': new_note.id, 'text': new_note.text})

@notes_bp.route('/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    note = Note.query.get(note_id)
    if not note:
        return jsonify({'error': 'Note not found'}), 404
    db.session.delete(note)
    db.session.commit()
    return jsonify({'message': 'Note deleted'})