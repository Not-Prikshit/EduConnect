import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

class DataManager:
    def __init__(self):
        self._ensure_data_dir()
        self.files = {
            'students': 'students.json',
            'teachers': 'teachers.json',
            'clubs': 'clubs.json',
            'notices': 'notices.json',
            'bookings': 'bookings.json',
            'meetings': 'meetings.json',
            'outlets': 'outlets.json'
        }
        self._init_files()

    def _ensure_data_dir(self):
        if not os.path.exists(DATA_DIR):
            os.makedirs(DATA_DIR)

    def _init_files(self):
        for key, filename in self.files.items():
            filepath = os.path.join(DATA_DIR, filename)
            if not os.path.exists(filepath):
                with open(filepath, 'w') as f:
                    json.dump([], f)

    def _read_json(self, filename):
        filepath = os.path.join(DATA_DIR, filename)
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def _write_json(self, filename, data):
        filepath = os.path.join(DATA_DIR, filename)
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=4)

    def get_all(self, entity):
        if entity in self.files:
            return self._read_json(self.files[entity])
        return []

    def save_all(self, entity, data):
        if entity in self.files:
            self._write_json(self.files[entity], data)

    def add_item(self, entity, item):
        data = self.get_all(entity)
        data.append(item)
        self.save_all(entity, data)
        return item

    def update_item(self, entity, item_id, updated_item, id_field='id'):
        data = self.get_all(entity)
        for i, item in enumerate(data):
            if item.get(id_field) == item_id:
                data[i] = {**item, **updated_item}
                self.save_all(entity, data)
                return data[i]
        return None

    def delete_item(self, entity, item_id, id_field='id'):
        data = self.get_all(entity)
        initial_len = len(data)
        data = [item for item in data if item.get(id_field) != item_id]
        if len(data) < initial_len:
            self.save_all(entity, data)
            return True
        return False

    def find_item(self, entity, key, value):
        data = self.get_all(entity)
        for item in data:
            if item.get(key) == value:
                return item
        return None
